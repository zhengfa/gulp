module.exports = {
    debug:true,     //调试模式，开启则调取framework的debug，否则调取release
    src:'src',      //工作目录
    dist:'release', //编译目录
    modules:[       //项目模块
        {
            "project_name":"来打卡",
            "check":true,
            "name":"punching",
            "framework":"mui"
        }
    ]
}