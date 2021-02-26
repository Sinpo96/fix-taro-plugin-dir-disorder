const fs = require('fs');
const shellJs = require('shelljs');

// 文件移动的描述
const moveToDir = (outPutPath) => {
    return [
        {
            from: `${ outPutPath }/`,
            to: `${ outPutPath }/miniprogram`,
            files: [
                'app.js',
                'app.json',
                'app.wxss',
                'runtime.js',
                'taro.js',
                'taro.js.LICENSE.txt',
                'vendors.js',
                'pages'
            ]
        },
        {
            from: `${ outPutPath }/miniprogram`,
            to: `${ outPutPath }/`,
            files: [
                'plugin'
            ]
        } ]
};

const mv = (to, filePath) => {
    shellJs.cp('-r', filePath, to);
    shellJs.rm('-r', filePath);
}

/**
 * @desc taro编译微信小程序插件目录结构错误，在这里纠正下（https://s3.us-west-2.amazonaws.com/secure.notion-static.com/dcbc2f3b-b032-42f1-be2c-647fcf7eb363/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210226%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210226T104005Z&X-Amz-Expires=86400&X-Amz-Signature=6a801d90ea02cd91d80120b50eb8c15ccae8609f75be33e8b177381f3a3725a2&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22）
 * @param ctx
 * @param options
 */
module.exports = (ctx, options) => {
    ctx.onBuildFinish(() => {
        console.log('编译结束！------------------------');
        // 输出路径
        const { outPutPath } = options;
        const files = fs.readdirSync(outPutPath);
        // 如果只有两个，那么就是插件第一次编译，只有["miniprogram","project.config.json"]，其实是不需要的，
        // console.log(`files:${ JSON.stringify(files) }`)
        if (files.length > 2) {
            try {
                const moveArr = moveToDir(outPutPath);
                for (const move of moveArr) {
                    // console.log(`move: ${ JSON.stringify(move) }`)
                    for (const file of move.files) {
                        const { from, to } = move;
                        const filePath = `${from}/${file}`;
                        console.log(`移动文件：${ filePath } 到 ${ to }`)
                        mv(to, filePath);
                    }
                }
            } catch (e) {
                console.error('文件移动失败，请重新编译');
            }
        }
    })
}
