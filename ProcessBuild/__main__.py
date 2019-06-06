#!/usr/bin/python
#
# 2019 Ensomniac Studios
# Author: Ryan Martin ryan@ensomniac.com

import os
import sys
import shutil

import index

class ProcessBuild:
    def __init__(self):
        self.unity = self.get_unity_content()
        self.content_path = os.path.join(self.unity["root"], "webglkit/")

        self.copy_files()
        self.modify_content()
        self.write_index()
        self.decompile_unity_js()

    def decompile_unity_js(self):
        import jsbeautifier

        unity_loader_content = file(self.unity["unity_loader"], "r").read()
        clean_unity_loader_content = jsbeautifier.beautify(unity_loader_content)
        clean_unity_loader_content = clean_unity_loader_content.replace("alert(r)", "console.log(r)");

        file(self.unity["unity_loader"], "w").write(clean_unity_loader_content)

    def modify_content(self):
        kitpath = os.path.join(self.content_path, "WebGlKit.js")
        content = file(kitpath, "r").read()
        content = content.replace("Build/webgl.json", self.unity["json_loader"])
        file(kitpath, "w").write(content)

    def copy_files(self):

        if os.path.exists(self.content_path):
            shutil.rmtree(self.content_path)

        content_root = os.path.join(__file__.split("/ProcessBuild/")[0], "content/")

        if not os.path.exists(content_root):
            print "Error: Unable to find content for webglkit. Expected: " + str(content_root)
            sys.exit()

        shutil.copytree(content_root, self.content_path)

    def write_index(self):
        index_path = os.path.join(self.unity["root"], "index.html")

        if os.path.exists(index_path):
            os.remove(index_path)

        file(index_path, "w").write(index.get(self))

    def get_unity_content(self):
        files = {}
        files["root"] = os.getcwd()
        files["index"] = os.path.join(files["root"], "index.html")
        files["build"] = os.path.join(files["root"], "Build/")
        files["build_name"] = None
        files["json_loader"] = None
        files["unity_loader"] = None

        if not os.path.exists(files["index"]):
            print "Error: This directory does not appear to be a Unity WebGL Build. Expected Build/"
            sys.exit()

        if not os.path.exists(files["index"]):
            print "Error: This directory does not appear to be a Unity WebGL Build. Expected index.html"
            sys.exit()

        for filename in os.listdir(files["build"]):
            if ".data." not in filename: continue
            if not filename.endswith(".unityweb"): continue
            files["build_name"] = filename.split(".data.")[0]
            break

        for filename in os.listdir(files["build"]):
            if not filename.endswith(".json"): continue
            files["json_loader"] = "Build/" + filename
            break

        for filename in os.listdir(files["build"]):
            if "UnityLoader.js" not in filename: continue
            files["unity_loader"] = "Build/" + filename
            break

        if not files["build_name"]:
            print "Error: Unable to determine name of build. Expected a file with .data. in /Build/ directory..."
            sys.exit()

        return files

if __name__ == "__main__":
    ProcessBuild()
