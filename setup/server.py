import http.server as srv
import HTTPSetup
import os
import socket
import pickle

portnr = 8912


# main function handling the server
def main():
    global portnr
    # clear previous state.
    with open(get_progress_location(), 'wb') as flush:
        pickle.dump({}, flush)

    # ensure that the CWD is the location of our server.py file
    os.chdir(os.path.dirname(os.path.realpath(__file__)))

    # retreive local IP address
    myip = socket.gethostbyname(socket.gethostname())
    if isLocalHost(myip):
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            try:
                s.connect(("gmail.com", 80))
                myip = s.getsockname()[0]
            except:
                pass
    if isLocalHost(myip):
        print(
            """ The automatic configuration server has started on port %d.
                Please navigate to something like http://192.168.0.xyz:%d to start the configuration process.
                Leave this window running!
            """ % (portnr, portnr))
    else:
        print(
            """ The automatic configuration server has started on port %d.
                Please navigate to http://%s:%d in your browser to start the configuration process.
                Leave this window running!
            """ % (portnr, myip, portnr))
    # setup address and server
    server_address = ('0.0.0.0', portnr)
    httpd = srv.HTTPServer(server_address, HTTPSetup.SetupHTTPRequestHandler)

    # start http server
    httpd.serve_forever()


def get_progress():
    progress = {}
    try:
        with open(get_progress_location(), 'rb') as prg:
            progress = pickle.load(prg)
    except FileNotFoundError:
        pass
    return progress


def update_progress(success, name, part, message, completed=100):
    cur_prog = get_progress()
    section = cur_prog.get(name, {})
    subsection = section.get(part, {})
    subsection['success'] = success
    subsection['message'] = message
    subsection['completed'] = completed
    if success and completed >= 100:
        subsection['status'] = 'done'
    elif success and completed <= 100:
        subsection['status'] = 'warning'
    elif not success and completed <= 100:
        subsection['status'] = 'error'
    section[part] = subsection
    cur_prog[name] = section
    with open(get_progress_location(), 'wb') as output:
        pickle.dump(cur_prog, output)


def get_progress_location():
    location = os.path.dirname(os.path.realpath(__file__))+'/progress.pkl'
    return location


def isLocalHost(ip):
    return ip == '127.0.0.1' or ip == '127.0.1.1'

if __name__ == '__main__':
    main()
