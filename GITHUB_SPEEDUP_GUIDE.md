# GitHub加速完全指南

## 当前仓库
- 地址：https://github.com/NeoKoo/make_neo_super_rich.git
- 问题：国内连接慢且不稳定

## 推荐方案

### 方案1：使用Gitee（码云）镜像 - 最推荐
1. 访问 https://gitee.com/
2. 注册并登录
3. 创建新仓库
4. 从GitHub导入当前仓库
5. 修改git remote指向Gitee

```bash
git remote set-url origin https://gitee.com/YourUsername/make_neo_super_rich.git
git pull origin main
```

### 方案2：配置npm镜像

```bash
npm config set registry https://registry.npmmirror.com
```

### 方案3：使用GitHub镜像站

```bash
# 使用FastGit镜像
git clone https://hub.fastgit.xyz/https://github.com/NeoKoo/make_neo_super_rich.git

# 或使用GitHub Proxy
git clone https://github.com.cnpmjs.org/https://github.com/NeoKoo/make_neo_super_rich.git
```

### 方案4：修改git配置优化

```bash
# 浅克隆
git clone --depth 1 https://github.com/NeoKoo/make_neo_super_rich.git

# 增加缓冲区
git config --global http.postBuffer 524288000
```

## 最佳实践

### 推荐组合：Gitee + npm镜像

```bash
# 1. 配置npm镜像
npm config set registry https://registry.npmmirror.com

# 2. 使用Gitee作为主仓库
git remote set-url origin https://gitee.com/YourUsername/make_neo_super_rich.git

# 3. GitHub作为备份
git remote add github https://github.com/NeoKoo/make_neo_super_rich.git

# 4. 日常使用
git pull origin main      # 从Gitee拉取（快）
git push origin main      # 推送到Gitee（快）
git push github main      # 推送到GitHub（备份）
```

## 推荐工具

- cnpm: npm install -g cnpm --registry=https://registry.npmmirror.com
- pnpm: npm install -g pnpm
- yarn: npm install -g yarn

选择其中一个替代npm使用。
