from ConfigChecks import CheckCouchDB
from ConfigChecks import BasicConfigChecks
from ConfigChecks import CheckSwitchCode
from ConfigChecks import CheckWiringPiConfig
import subprocess

prog_callback = None
check_couchdb = None
check_wiringpi = None
check_switch = None


def start_setup(progress_callback):
    global prog_callback, check_couchdb, check_switch, check_wiringpi
    prog_callback = progress_callback
    if not check_couchdb:
        check_couchdb = CheckCouchDB(prog_callback)
    if not check_switch:
        check_switch = CheckSwitchCode(prog_callback)
    if not check_wiringpi:
        check_wiringpi = CheckWiringPiConfig(prog_callback)
    # check/install couchdb
    if install_couchdb(check_couchdb):
        # check if couchdb is up and running
        if check_couchdb.available():
            # check if couchdb is correctly configured
            check_couchdb.configured()
            # check if the permissions are correct for execution
            check_switch.permissions()
            # install switchit, requires couchdb to be available
            check_switch.install()
        else:
            print("CouchDB is not available! start it!")
    # check if wiringpi is installed
    check_wiringpi.installed()
    # check if executables have the correct permissions


def install_couchdb(check):
    if check.installed():
        return True
    if check.root_rights():
        prog_callback(success=True, name="CouchDB", part="Installed", message="CouchDB is being installed", completed=50)
        install_program('couchdb')
    return check.installed()


def install_program(program_name):
    check = BasicConfigChecks(prog_callback)
    if not check.program_exists([program_name]):
        try:
            subprocess.call(['sudo', 'apt-get', 'install', program_name])
            return
        except Exception:
            pass

        try:
            subprocess.call(['sudo', 'pacman', '-S', program_name])
            return
        except Exception:
            pass

        try:
            subprocess.call(['sudo', 'yum', 'install', program_name])
            return
        except Exception:
            pass
    return False
