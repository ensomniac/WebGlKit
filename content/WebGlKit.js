
function WebGlKit(){
    this.html = $("<div></div>");
    this.view = $("<div id='unity_container'></div>"); // Unity
    this.load_flag = $("<div>Loading</div>");

    this.width = 0;
    this.height = 0;

    this.view_width = 0;
    this.view_height = 0;

    this.splash_timeout = 2000;
    this.waiting_for_splash = false;
    this.fully_loaded = false;

    this.unity_loader = null;

    this.options = {};
    this.options["background"] = "rgb(60, 60, 60)";
    this.options["border_radius"] = 6;
    this.options["shadow_opacity"] = 0.5;
    this.options["aspect"] = 1.777;

    this.on_load_progress = function(progress_t){
        console.log("Unity Load " + progress_t);
        this.load_flag.text("Loading WebGL (" + parseInt(progress_t*100) + "%)");
    };

    this.on_unity_visible = function(){
        // Called once Unity is completely visible and the fade flag has been removed
        console.log("this.on_unity_visible");
    };

    this.LoadUnity = function(){
        this.unity_loaded = true;

        if (window.location.href.indexOf("/Users/") > 0) {
            var msg = "Error: WebGlKit only works on a hosted server";
            console.log(msg);
            this.load_flag.text(msg);
            return;
        };

        this.load_flag.text("Initiating");

        (function(self){

            self.unity_loader = UnityLoader.instantiate("unity_container", "Build/webgl.json", {
                onProgress: function(instance, progress_t){self.on_load_progress(progress_t)}
            });

            window.unity = self.unity_loader;

        })(this);

    };

    this.check_unity_load = function(){
        // Called to see if Unity is actually loaded and playing

        if (!this.unity_loader) {return;};
        if (!this.unity_loader.Module) {return;};
        if (!this.unity_loader.Module.calledRun) {return;};
        if (this.waiting_for_splash) {return;};
        if (this.fully_loaded) {return;};

        if (!this.waiting_for_splash) {
            this.waiting_for_splash = true;

            (function(self){

                setTimeout(function(){
                    self.load_flag.stop().animate({"opacity": 0}, function(){
                        self.waiting_for_splash = false;
                        self.fully_loaded = true;
                        self.on_unity_visible();
                    });
                }, self.splash_timeout);

            })(this);

            return;
        };

    };

    this.setup_styles = function(){

        this.html.append(this.view);
        this.html.append(this.load_flag);

        var shadow = "rgba(0,0,0," + this.options["shadow_opacity"] + ")";

        $("body").css({
            "overflow": "hidden",
        });

        this.html.css({
            "position": "absolute",
            "left": 0,
            "top": 0,
            "background": this.options["background"],
        });

        this.view.css({
            "position": "absolute",
            "left": 0,
            "top": 0,
            "background": "#222",
            "overflow": "hidden",
            "border-radius": this.options["border_radius"],
            "-webkit-box-shadow": "0px 5px 20px 0px " + shadow,
            "-moz-box-shadow": "0px 5px 20px 0px " + shadow,
            "box-shadow": "0px 5px 20px 0px " + shadow,
        });

        this.load_flag.css({
            "position": "absolute",
            "left": 0,
            "top": 0,
            "background": "#111",
            "text-align": "center",
            "border-radius": this.options["border_radius"],
        });

        (function(self){

            requestAnimationFrame(function(){
                self.draw();
            });

            $(window).resize(function(){
                self.draw();
            });

            setInterval(function(){
                self.check_unity_load();
            }, 500);

        })(this);

    };

    this.draw = function(){
        this.width = $(window).width();
        this.height = $(window).height();

        if (this.height > this.width) {
            // Portrait

            var aspect = this.height/this.width;
            this.padding = this.height*0.025;

            if (aspect > this.options["aspect"]) {
                this.view_width = this.width-this.padding;
                this.view_height = this.view_width*this.options["aspect"];
            }
            else {
                this.view_height = this.height-this.padding;
                this.view_width = this.view_height/this.options["aspect"];
            }

        }
        else {
            // Landscape
            var aspect = this.width/this.height;

            this.padding = this.width*0.025;

            if (aspect > this.options["aspect"]) {
                this.view_height = this.height-this.padding;
                this.view_width = this.view_height*this.options["aspect"];
            }
            else {
                this.view_width = this.width-this.padding;
                this.view_height = this.view_width/this.options["aspect"];
            }

        };

        this.html.css({
            "width": this.width,
            "height": this.height,
        });

        this.view.css({
            "left": (this.width*0.5)-(this.view_width*0.5),
            "top": (this.height*0.5)-(this.view_height*0.5),
            "width": this.view_width,
            "height": this.view_height,
        });

        if (this.load_flag) {
            this.load_flag.css({
                "left": (this.width*0.5)-(this.view_width*0.5),
                "top": (this.height*0.5)-(this.view_height*0.5),
                "width": this.view_width,
                "height": this.view_height,
                "line-height": this.view_height + "px",
                "color": "rgba(255, 255, 255, 0.7)",
            });
        };

        if (!this.unity_loaded) {
            this.LoadUnity();
        };

    };

    this.setup_styles();

};

$(document).ready(function() {
    window.WebGlKit = new WebGlKit();
    $("body").empty().append(window.WebGlKit.html);
});
