from ConfigChecks import CheckCouchDB
from ConfigChecks import BasicConfigChecks
import subprocess

prog_callback = None
check_couchdb = None


def start_setup(progress_callback):
    global prog_callback, check_couchdb
    prog_callback = progress_callback
    if not check_couchdb:
        check_couchdb = CheckCouchDB(prog_callback)
    if install_couchdb(check_couchdb):
        if check_couchdb.available():
            check_couchdb.configured()
        else:
            print("CouchDB is not available! start it!")


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
