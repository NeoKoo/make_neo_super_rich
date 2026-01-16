#!/bin/bash

echo "🚀 GitHub加速配置脚本"
echo "========================="
echo ""

# 检查当前git仓库
if [ ! -d ".git" ]; then
    echo "❌ 当前目录不是一个git仓库"
    echo "   请先初始化git仓库"
    exit 1
fi

echo "✅ 检测到git仓库"
echo ""

# 配置npm镜像
echo "📦 配置npm镜像..."
npm config set registry https://registry.npmmirror.com

if [ $? -eq 0 ]; then
    echo "✅ npm镜像配置成功"
    echo "   当前源: $(npm config get registry)"
else
    echo "❌ npm镜像配置失败"
    exit 1
fi

echo ""

# 显示当前远程仓库
echo "📋 当前远程仓库："
git remote -v
echo ""

# 显示建议
echo "🎯 后续步骤建议："
echo ""
echo "1. 在Gitee创建仓库（推荐）"
echo "   - 访问: https://gitee.com/"
echo "   - 注册/登录"
echo "   - 创建新仓库"
echo "   - 从GitHub导入: https://github.com/NeoKoo/make_neo_super_rich.git"
echo ""
echo "2. 添加Gitee远程仓库："
echo "   git remote add gitee https://gitee.com/你的用户名/make_neo_super_rich.git"
echo ""
echo "3. 拉取Gitee代码："
echo "   git pull gitee main"
echo ""
echo "4. 推送到Gitee："
echo "   git push gitee main"
echo ""
echo "5. GitHub作为备份："
echo "   git push github main"
echo ""

echo "📊 npm镜像已配置，后续安装依赖会很快！"
echo ""
echo "💡 提示："
echo "   - 日常开发使用Gitee"
echo "   - GitHub作为备份仓库"
echo "   - 定期同步到两个仓库"
echo ""
