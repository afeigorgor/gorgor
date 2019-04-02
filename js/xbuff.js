/*
请使用JSBox
支持下载，复制链接。
上滑下拉可切换视频。
欢迎关注ss频道
https://t.me/gorgorshare

*/
if($app.info.bundleID == "app.cyan.pin"){
    $ui.alert("请使用JSBox");
    return;
}
var itemHeight = $device.info.screen.height
const base64 = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2FmZWlnb3Jnb3IvZ29yZ29yL21hc3Rlci9qcy94YnVmZi5qc29u"
$ui.loading(true)
$http.get({
  url: $text.base64Decode(base64.replace(/lz/, "20")),
  handler: function(resp) {
    $ui.loading(false)
    if (resp.response.statusCode == "200") {
      var info = resp.data;
      if (info.bb != "1.0") {
        $ui.alert({
          title: "温馨提示",
          message: info.gxsm,
          actions: [{
            title: "进入TG更新频道",
            handler: function() {
              $app.openURL(info.gw)
            }
          }, {
            title: "关注TG频道",
            handler: function() {
              $ui.alert({
                title: "温馨提示",
                message: "手机端请先安装Telegram",
                actions: [{
                  title: "跳转TG会自动复制频道链接",
                  handler: function() {
                    $clipboard.text = "https://t.me/gorgorshare"
                    $app.openURL("https://t.me/gorgorshare")
                  }
                }, {
                  title: "取消"
                }]
              })
            }
          }]
        })
      } else {
        $cache.set("info", info)
        getdata()
      }

    } else {
      $ui.alert("加载失败")
    }
  }
})

var timg = "https://raw.githubusercontent.com/afeigorgor/gorgor/master/js/tu/"
$ui.render({
    props: {
        id: "mView",
        statusBarStyle: 0,
        navBarHidden: true,
        statusBarHidden: true,
        bgcolor: $color("black")
    },
    views: [{
        type: "matrix",
        props: {
            id: "Video",
            bgcolor: $color("black"),
            itemHeight: itemHeight,
            columns: 1,
            spacing: 0,
            waterfall: false,
            template: [{
                type: "video",
                props: {
                    id: "video",
                },
                layout: function (make, view) {
                    make.left.right.top.bottom.inset(-3)
                }
            }]
        },
        layout: function (make) {
            make.bottom.left.right.top.inset(0)
        },
        events: {
            didSelect: function (sender, indexPath, data) {
                $("video").toggle()
            },
            didReachBottom: function (sender) {
                sender.endFetchingMore()
                cldata()
            },
            pulled: function (sender) {
                sender.endRefreshing()
                xldata()

            }
        }
    },
    {
        type: "button",
        props: {
            id: "x_img",
            src: timg + "x.png"
        },
        events: {
            tapped: function (sender) {
                $app.close()
            }
        },
        layout: function (make, view) {
            make.top.left.inset(5);
            make.width.height.equalTo(50);
        }
    }, {
        type: "button",
        props: {
            id: "xia_img",
            src: timg + "xia.png"
        },
        events: {
            tapped: function (sender) {
                download($("video").src)
            }
        },
        layout: function (make, view) {
            make.top.inset(2);
            make.left.equalTo($("x_img").right).inset(15);
            make.width.height.equalTo(58);
        }
    }, {
        type: "button",
        props: {
            id: "fuzhi_img",
            src: timg + "fuzhi.png"
        },
        events: {
            tapped: function (sender) {
                $clipboard.text = $("video").src
                $ui.toast("已复制");
            }
        },
        layout: function (make, view) {
            make.top.inset(5);
            make.left.equalTo($("xia_img").right).inset(15);
            make.width.height.equalTo(50);
        }
    }, {
        type: "button",
        props: {
            id: "hb_img",
            src: timg + "ssr.png"
        },
        events: {
            tapped: function (sender) {
                $app.openURL(
                    "https://ss.gorgor.top"
                );
            }
        },
        layout: function (make, view) {
            make.top.inset(5);
            make.left.equalTo($("fuzhi_img").right).inset(15);
            make.width.height.equalTo(50);
        }
    }],
})

$cache.set("py", 1);
function getdata(url) {
    $http.post({
        url: $cache.get("info").turl + $cache.get("py"),
        header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "iphoneLive/1.1 (iPhone; iOS 12.0; Scale/2.00)"
        },
        handler: function (resp) {
            var data = resp.data.data.info;
            $cache.set("vdata", data);
            $cache.set("dqshu", 1);
            cldata()
        }
    });
}

function cldata() {
    var dqshu = $cache.get("dqshu");
    var vdata = $cache.get("vdata");
    if (vdata.length == 0) {
        $ui.toast("数据正在加载中...");
    } else if (vdata.length != dqshu) {
        var arr = vdata[dqshu - 1]
        $("Video").data = [{ video: { src: arr.href, poster: arr.thumb_s } }]
        $cache.set("dqshu", dqshu + 1);
        $delay(1, function () {
            $("video").toggle()
        })
    } else {
        var py = $cache.get("py") + 1;
        $cache.set("py", py);
        getdata()
    }
}
function xldata() {
    var dqshu = $cache.get("dqshu");
    var vdata = $cache.get("vdata");
    if (vdata.length == 0) {
        $ui.toast("数据正在加载中...");
    } else if (dqshu > 1) {
        var arr = vdata[dqshu]
        $("Video").data = [{ video: { src: arr.href, poster: arr.thumb_s } }]
        $cache.set("dqshu", dqshu - 1);
        $delay(1, function () {
            $("video").toggle()
        })
    } else {
        var arr = vdata[0]
        $("Video").data = [{ video: { src: arr.href, poster: arr.thumb_s } }]
    }
}

function download(url) {
    $ui.toast("正在下载中 ...");
    $ui.loading(true);
    $http.download({
        url: url,
        handler: function (resp) {
            $ui.loading(false);
            if (resp.response.statusCode == "200") {
                $share.sheet(["download.mp4", resp.data]);
            } else {
                $ui.alert("下载失败");
            }
        }
    });
}
