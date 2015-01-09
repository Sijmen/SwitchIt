import os
import subprocess
from configparser import ConfigParser
# import urllib.request
import requests
import json
import stat


class BasicConfigChecks():
    def __init__(self, progress_callback):
        self.progress_callback = progress_callback
        self.check_name = "basic_configuration_check"
        pass

    def root_rights(self):
        """asume root rights with sudo"""
        return True

    def switchit_basedir(self):
        current_dir = os.path.dirname(os.path.realpath(__file__))
        base_dir = os.path.dirname(current_dir)
        return base_dir

    def program_exists(self, program_args):
        try:
            with open(os.devnull, "w") as fnull:
                subprocess.call(program_args, stdout=fnull)
        except OSError as e:
            if e.errno == os.errno.ENOENT:
                return False
        return True

    def progress(self, success, part, message, completed=100):
        self.progress_callback(success, self.check_name, part, message, completed)


class CheckCouchDB(BasicConfigChecks):
    def __init__(self, progress_callback):
        print("Init CouchDB checks")
        super(CheckCouchDB, self).__init__(progress_callback)
        self.port = self.get_config('httpd', 'port')
        self.bind_address = self.get_config('httpd', 'bind_address')
        self.admin = None
        self.adminpass = None
        self.has_admin = False
        self.ip = "127.0.0.1"
        self.check_name = "CouchDB"

    def installed(self):
        print("Checking CouchDB Installed")
        installed = self.program_exists(['couchdb', '-h'])
        if installed:
            self.progress(success=True, part="Installed", message="CouchDB is installed", completed=100)
        else:
            self.progress(success=False, part="Installed", message="CouchDB not is installed", completed=0)
        return installed

    def have_admin_rights(self):
        if self.has_admin:
            # assuming lazy evaluation
            return self.admin and self.adminpass and self.verify_login()
        else:
            # with no admins, everybody is an admin!
            return True

    def configured(self):
        print("Checking CouchDB Configured")
        try:
            admins = self.get_conf_options('admins')
            if len(admins) > 0:
                self.has_admin = True
                if self.admin and self.adminpass:
                    self.progress(success=True, part="Admins", message="The following admins are configured: %s. Login is provided for %s." % (",".join(admins), self.admin), completed=100)
                else:
                    self.progress(success=True, part="Admins", message="The following admins are configured: %s. Please provide login information for one of them." % ",".join(admins), completed=50)
            else:
                self.progress(success=True, part="Admins", message="No admins are configured. You can do this at the end of the setup.")
            if self.have_admin_rights:
                self.start_auto_configure()
        except IndexError:
            self.progress(success=False, part="Configuration", message="No configuration file found!", completed=0)
        return False

    def get_config(self, section, name):
        confParser = self.get_conf_parser()
        result = ""
        if confParser.has_section(section):
            result = confParser.get(section, name)
        return result

    def get_config_files(self):
        proc = subprocess.Popen(['couchdb', '-c'], stdout=subprocess.PIPE)
        output = proc.communicate()[0]
        configs = output.splitlines()
        return configs

    def get_conf_parser(self):
        configs = self.get_config_files()
        confParser = ConfigParser()
        confParser.read(configs)
        return confParser

    def get_conf_options(self, section):
        confParser = self.get_conf_parser()
        result = []
        if confParser.has_section(section):
            result = confParser.options(section)
        return result

    def check_conf_set(self, section, name):
        confParser = self.get_conf_parser()
        if confParser.has_section(section):
            return confParser.has_option(section, name)
        return False

    def available(self):
        print("Checking CouchDB Available")
        if not self.port:
            self.port = self.get_config("httpd", "port")
        if self.port and self.ip:
            result = requests.get("%s" % self.get_url())
            print(result.json())
            return "version" in result.json()
        else:
            self.progress(success=False, part="Available", message="IP address or Port of Couchdb are not known!", completed=0)
            return False

    def get_status(self):
        return json.dumps({
            "port": self.port,
            "bind_address": self.bind_address,
            "admin": self.admin,
            "has_admin": self.has_admin,
            "adminpass": self.adminpass,
            })

    def start_auto_configure(self):
        if not self.have_admin_rights():
            print("No admin rights, thus configuration cannot be edited!")
            return

        session = requests.Session()
        part = "default_configuration"
        # log in couchdb if an admin is available
        if self.has_admin:
            session.post("%s/_session" % self.get_url(), data={"name": self.admin, "password": self.adminpass})

        if self.bind_address != "0.0.0.0":
            # force write, because bind_address is always available
            if self.save_setting('httpd', 'bind_address', '0.0.0.0', session, force_write=True):
                self.progress(True, part, "Succesfully configured bind address")
            else:
                self.progress(False, part, "Could not configure bind address", progress=0)
        else:
            self.progress(True, part, "Succesfully configured bind address")

        part = "custom_configuration"
        success = True
        messages = []
        # assuming the nodejs server runs locally. Could be a remote location though
        if self.save_setting('http_global_handlers', '_nodejs', '{couch_httpd_proxy, handle_proxy_req, <<"http://127.0.0.1:8000">>}', session):
            success = success and True
            messages.append({"message": "Succesfully configured global proxy handler for nodejs server", "success": True})
        else:
            success = False
            messages.append({"message": "Could not configure global http handler for nodejs proxy.", "success": False})

        base_dir = self.switchit_basedir()

        # assuming 'nodejs' as name for the binary file,
        # maybe 'node' is more appropiate. Or check
        if self.save_setting('os_daemons', 'nodejs_server', '/usr/bin/nodejs %s/server.js' % base_dir, session):
            success = success and True
            messages.append({"message": "Succesfully configured os daemon for nodejs server.", "success": True})
        else:
            success = False
            messages.append({"message": "Could not configure os daemon for nodejs server.", "success": False})
        completed = 100 if success else 0
        self.progress(success, part, messages, completed)
        self.reboot_couchdb(session)

    def reboot_couchdb(self, session=None):
        """
        Reboot CouchDB. Usses session if provided.
        """
        if self.have_admin_rights():
            if not session:
                session = self.session_login()
                if not session:
                    self.progress(False, "Restart", "Failed to restart CouchDB.")
                else:
                    self.progress(True, "Restart", "Restarting CouchDB.")
                    session.post("%s/_restart", self.get_url)

    def get_url(self, secure=False):
        """
        Return the endpoint of the database.
        """
        url = ""
        if secure:
            url = "https://"
        else:
            url = "http://"
        url += "%s:%s" % (self.ip, self.port)
        return url

    def save_setting(self, section, name, value, session=None, force_write=False):
        """
        Save a setting from the section with a specified name. Values will be
        turned into JSON strings. If a session is provided, this will be used.
        If force_write, the value is overwritten, otherwise if the setting
        already exists, no action will be taken!
        """
        if not force_write and self.check_conf_set(section, name):
            return True

        if not session:
            session = requests.Session()
        url = "%s/_config/%s/%s" % (self.get_url(), section, name)
        result = session.put(url, data=json.dumps(value))
        if not result.ok:
            print("Failed to save setting: [%s] %s=%s" % (section, name, json.dumps(value)))
            print("Error:", result.json())
            return False
        return True

    def session_login(self):
        """
        Returns a session that is logged in to
        the CouchDB server
        """
        if self.have_admin_rights():
            session = requests.Session()
            result = session.post("%s/_session" % (self.get_url()), data={"name": self.admin, "password": self.adminpass})
            if result.ok:
                return session
        return None

    def verify_login(self):
        """
        Verify set credentials.
        """
        if not self.port:
            self.port = self.get_config("httpd", "port")
        result = requests.post("%s/_session" % self.get_url(), data={"name": self.admin, "password": self.adminpass})
        return result.ok


class CheckWiringPiConfig(BasicConfigChecks):
    def __init__(self, progress_callback):
        super(CheckWiringPiConfig, self).__init__(progress_callback)
        self.check_name = "wiringpi"

    def installed(self):
        proc = subprocess.Popen(['gpio', '-v'], stdout=subprocess.PIPE)
        output = proc.communicate()[0]
        version = output.splitlines()[0]
        version = version.split(":")[1].strip()
        if version:
            self.progress(True, "Installed", "Wiring pi version %s is installed" % version, progress=100)
            return False
        else:
            self.progress(False, "Installed", "Wiring pi could not be found. Please install", progress=0)
            return True


class CheckSwitchCode(BasicConfigChecks):
    def __init__(self, progress_callback):
        super(CheckSwitchCode, self).__init__(progress_callback)
        self.check_name = "switchcode"

    def permissions(self):
        files = [
            {
                'name': self.switchit_basedir()+'/lights/action.o',
                'correct_permission': False
            },
            {
                'name': self.switchit_basedir()+'/lights/blokker.o',
                'correct_permission': False
            },
            {
                'name': self.switchit_basedir()+'/lights/elro.o',
                'correct_permission': False
            },
            {
                'name': self.switchit_basedir()+'/lights/kaku.o',
                'correct_permission': False
            }
        ]
        all_correct = True
        for fileinfo in files:
            fileinfo["correct_permission"] = oct(stat.S_IMODE(os.stat(fileinfo["name"]).st_mode)) == '06110'
            all_correct = all_correct and fileinfo["correct_permission"]
        if all_correct:
            self.progress(True, "Permission", "File permissions for switches are correct")
        else:
            self.progress(False, "Permission", "Incorrect file permissions for switches")