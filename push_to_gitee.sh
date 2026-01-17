#!/bin/bash

echo "🚀 推送代码到Gitee"
echo "========================="
echo ""
echo "当前配置："
git remote -v
echo ""
echo "推送方式选择："
echo "1) 尝试推送"
echo "2) 配置认证信息"
echo "3) 使用GitHub镜像推送"
echo "4) 退出"
echo ""
read -p "请选择 (1-4): " -n 1 -r

case $REPLY in
    1)
        echo ""
        echo "📤 正在推送到Gitee..."
        echo ""
        if git push origin main; then
            echo ""
            echo "✅ 推送成功！"
            echo ""
            echo "🔗 Gitee仓库地址："
            echo "   https://gitee.com/neokoo/make_neo_super_rich"
        else
            echo ""
            echo "❌ 推送失败"
            echo ""
            echo "💡 可能的原因："
            echo "   1. 网络连接问题"
            echo "   2. Gitee认证信息不正确"
            echo "   3. Gitee仓库地址错误"
        fi
        ;;
    2)
        echo ""
        echo "📝 配置认证信息"
        echo ""
        echo "方式A：HTTPS + Personal Access Token（推荐）"
        echo "  1. 访问 Gitee.com → 个人设置 → 私人令牌"
        echo "  2. 生成新的Token"
        echo "  3. 复制Token"
        echo ""
        read -p "请输入Gitee用户名: " username
        read -sp "请输入Gitee Token: " token
        echo ""
        echo "配置认证信息..."
        git config --global credential.helper store
        echo "https://${username}:${token}@gitee.com" | git credential approve
        ;;
    3)
        echo ""
        echo "🔄 使用GitHub镜像推送"
        echo ""
        echo "1. 先推送到GitHub"
        echo "2. GitHub会自动同步到Gitee（如果配置了）"
        echo ""
        echo "是否推送到GitHub？ (y/n): " -n 1 -r
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "📤 正在推送到GitHub..."
            git push github main
        fi
        ;;
    4)
        echo ""
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "按任意键退出..."
read -n 1
