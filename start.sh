#!/bin/bash

# PWA彩票选号助手 - 快速启动脚本
# 用途：一键安装依赖、配置环境、启动开发服务器

echo "🎯 PWA彩票选号助手 - 快速启动"
echo "========================================"
echo ""

# 检查Node.js版本
echo "📦 检查Node.js版本..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装！"
    echo "请访问 https://nodejs.org/ 下载并安装"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js版本: $NODE_VERSION"

# 检查npm版本
echo "📦 检查npm版本..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装！"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm版本: $NPM_VERSION"
echo ""

# 检查.env文件
echo "🔐 检查环境配置..."
if [ ! -f .env ]; then
    echo "⚠️  .env文件不存在，从.env.example复制..."
    cp .env.example .env
    echo "✅ 已创建.env文件"
    echo ""
    echo "📝 请编辑.env文件，添加您的API密钥："
    echo "   VITE_JUHE_API_KEY=your_api_key_here"
    echo ""
    echo "💡 提示：API密钥申请地址：https://www.jisuapi.com/api/caipiao/"
    echo ""
    read -p "是否现在编辑.env文件？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-vi} .env
    fi
else
    echo "✅ .env文件已存在"
    
    # 检查是否配置了API密钥
    if grep -q "your_api_key_here" .env; then
        echo "⚠️  警告：API密钥尚未配置！"
        echo "   请编辑.env文件，将VITE_JUHE_API_KEY设置为您的密钥"
        echo ""
        echo "💡 如不配置API，应用仍可使用，但无法查询开奖结果"
    else
        echo "✅ API密钥已配置"
    fi
fi
echo ""

# 安装依赖
echo "📦 安装项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "首次安装，可能需要几分钟..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ 依赖安装成功"
    else
        echo "❌ 依赖安装失败！"
        exit 1
    fi
else
    echo "✅ 依赖已安装（跳过）"
    echo ""
    echo "💡 如需重新安装，请运行："
    echo "   rm -rf node_modules package-lock.json"
    echo "   npm install"
fi
echo ""

# 显示项目信息
echo "📊 项目信息："
echo "   项目名称：彩票选号助手"
echo "   技术栈：React + TypeScript + Vite + TailwindCSS"
echo "   PWA支持：是"
echo ""

# 提供操作选项
echo "========================================"
echo "请选择操作："
echo "  1) 启动开发服务器"
echo "  2) 构建生产版本"
echo "  3) 预览生产构建"
echo "  4) 运行Lighthouse测试"
echo "  5) 查看项目文档"
echo "  6) 退出"
echo ""
read -p "请输入选项 (1-6): " -n 1 -r
echo ""

case $REPLY in
    1)
        echo "🚀 启动开发服务器..."
        echo ""
        npm run dev
        ;;
    2)
        echo "🏗  构建生产版本..."
        npm run build
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ 构建成功！"
            echo "   输出目录：dist/"
            echo ""
            echo "💡 运行 'npm run preview' 预览构建"
        fi
        ;;
    3)
        echo "👀 预览生产构建..."
        npm run preview
        ;;
    4)
        echo "🔍 运行Lighthouse测试..."
        echo ""
        echo "💡 请确保开发服务器正在运行（选项1）"
        echo "💡 然后访问 http://localhost:3000"
        echo "💡 在Chrome开发者工具中运行Lighthouse"
        echo ""
        echo "Lighthouse测试地址："
        echo "   chrome://lighthouse"
        ;;
    5)
        echo "📚 项目文档："
        echo ""
        echo "1. README.md - 项目说明和快速开始"
        echo "2. SETUP_GUIDE.md - 详细的安装配置指南"
        echo "3. TEST_PLAN.md - 完整的测试清单"
        echo "4. DEPLOY_GUIDE.md - Vercel部署指南"
        echo "5. PROJECT_SUMMARY.md - 项目交付总结"
        echo ""
        read -p "是否在浏览器中打开README.md？(y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if command -v open &> /dev/null; then
                open README.md
            elif command -v xdg-open &> /dev/null; then
                xdg-open README.md
            else
                echo "请手动打开README.md文件"
            fi
        fi
        ;;
    6)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选项，请重新运行脚本"
        exit 1
        ;;
esac
