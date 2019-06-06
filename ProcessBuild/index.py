#!/usr/bin/python
#
# 2019 Ensomniac Studios
# Author: Ryan Martin ryan@ensomniac.com

import os
import sys

class Index:
    def __init__(self, build):
        self.build = build

    def get(self):

        title = self.build.unity["build_name"]

        content = []
        content.append("<!DOCTYPE html>")
        content.append("<html lang='en-us'>")
        content.append("  <head>")
        content.append("    <meta charset='utf-8'>")
        content.append("    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>")
        content.append("    <title>" + title + "</title>")
        content.append("    <link rel='stylesheet' href='webglkit/core.css'>")
        content.append("    <script src='webglkit/jquery.js'></script>")
        content.append("    <script src='webglkit/WebGlKit.js'></script>")
        content.append("    <script src='Build/UnityLoader.js'></script>")
        content.append("  </head>")
        content.append("  <body>")
        content.append("  </body>")
        content.append("</html>")

        return "\n".join(content)

def get(build):
    return Index(build).get()

