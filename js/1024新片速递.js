/*
脚本仅供代码学习，请勿分享。非法传播造成法律问题与作者无关！
如打不开，请关闭科学上网
by:F_GorGor
科学上网
https://ss.gorgor.top
*/


$cache.set("id", "3")
$cache.set("pg", 1)
var urlt = "http://w1.97xzjpzz.info/"
var data = [{"name": "最新合集","id": "3"}, {"name": "亚洲無碼","id": "5"}, { "name": "日本騎兵", "id": "22" }, { "name": "歐美新片", "id": "7" }, { "name": "网摘收藏", "id": "110"}, { "name": " 三級寫真", "id": "18" },]

$ui.render({
    props: {
        title: "1024新片速递"
    },
    views: [{
        type: "menu",
        props: {
            id: "meun",
            items: data.map(function (item) {
                return item.name
            }),
        },
        layout: function (make) {
            make.left.top.right.equalTo(0)
            make.height.equalTo(40)

        },
        events: {
            changed: function (sender) {
                $cache.set("id", data[sender.index].id)
                $cache.set("pg", 1)
                getdata()
            }
        }
    },
    {
        type: "list",
        layout: function (make) {
            make.right.left.bottom.inset(0)
            make.top.equalTo($("meun").bottom)
        },
        events: {
            didSelect: function (sender, indexPath, data) {
                var id = data.split("\n")
                geting(id[1], id[0])
            },
            didReachBottom: function (sender) {
                sender.endFetchingMore()
                var page = $cache.get("pg") + 1
                $cache.set("pg", page)
                getdata()
            }
        }

    },]
})

function getdata() {
    var id = $cache.get("id")
    var pg = $cache.get("pg")
    $ui.loading(true)
    $http.get({
        url: urlt + "pw/thread-htm-fid-" + id + "-page-" + pg + ".html",
        handler: function (resp) {
            $ui.loading(false)
            var text = resp.data.replace(/\n|\s|\r/g, "")
            if (text.indexOf('普通主题') !== -1) {
                text = text.split("普通主题")[1]
            }
            var shu = text.match(/class=\"tr3t_one\">(\S*?)<\/h3>/g)
            if (pg == 1) {
                var data = []
            } else {
                var data = $("list").data
            }
            for (i in shu) {
                var a = shu[i]
                if (a.indexOf('href=') !== -1) {
                    var txt = a.split("<h3>")[1]
                    var mc = txt.match(/\">(\S*?)<\/a>/)[1]
                    var id = a.match(/href=\"(\S*?)\"/)[1]
                    data.push(mc + "\n" + id)
                }
            }
            $("list").data = data
            $("list").endFetchingMore()
        }
    })
}

getdata()

function geting(id, mc) {
    $ui.loading(true)
    $http.get({
        url: urlt + "pw/" + id,
        handler: function (resp) {
            $ui.loading(false)
            var text = resp.data.match(/id=\"read_tpc\">.*?<\/div>/)
            text = text[0].replace('id=\"read_tpc\">', "")
            var shu = $detector.link(text);
            var url = shu[shu.length - 2]
            var html = `<html><head><meta charset="UTF-8"><title>${mc}</title><style> body,div{ font-size:42px;} </style> </head><body><div>${text}</body></html>`
            $ui.push({
                props: {
                    title: mc
                },
                views: [{
                    type: "web",
                    props: {
                        html: html,
                    },
                    layout: $layout.fill
                }, {
                    type: "button",
                    props: {
                        id: "hb_img",
                        src: "https://raw.githubusercontent.com/afeigorgor/gorgor/master/js/tu/xunlei.png",
                        radius: 30
                    },
                    events: {
                        tapped: function (sender) {
                            geturl(url, 1)
                        },
                        longPressed: function (sender) {
                            geturl(url, 2)
                        }
                    },
                    layout: function (make, view) {
                        make.top.inset(10)
                        make.width.height.equalTo(70)
                        make.right.inset(10)
                    }
                },]
            })
        }
    })
}

function geturl(url, dian) {
    $http.get({
        url: url,
        handler: function (resp) {
            $ui.loading(false)
            var text = resp.data.replace(/\n|\s|\r/g, "")
            var url = text.match(/<aclass=\"uk-button\"onclick=\"setpos\(\);\"href=\"(\S*?)\"/)[1]
            url = url.replace(/amp;/g, "")
            $clipboard.text = url
            if (dian == 1) {
                var canOpen = $app.openURL("thunder://" + url);
                if (!canOpen) {
                    $ui.alert({
                        message: "请先安装迅雷",
                        actions: [{
                            title: "跳转安装",
                            handler: function () {
                                $app.openURL("https://blog.gorgor.top/tool");
                            }
                        },
                        {
                            title: "复制磁力链接",
                            handler: function () {
                                alert("已复制\n"+url)
                            }
                        }
                        ]
                    })
                }
            }else{
                alert("已复制磁力链接")
            }
            
        }
    })
}

