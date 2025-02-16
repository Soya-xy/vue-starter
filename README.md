# 管理界面

**typescript版本固定在5.5.4，5.6.2有问题**

## .env.local

```conf
# 后台服务地址
API_SERVER=http://127.0.0.1:3000
# 交通流量服务地址
API_TRAFFIC=http://127.0.0.1:3001
# 配电房服务地址
API_POWER=http://127.0.0.1:4000
# AR数据导入服务地址
API_CVOS=http://127.0.0.1:5000
# 资源文件反向代理服务地址（nginx）
FILE_SERVER=http://127.0.0.1
# NATS Websocket服务地址
NATS_SERVER=127.0.0.1:2222
```

## 地图配置

默认配置文件是`public/map.json`，里面只有最基本的内容，在上传自定义地图配置文件之前临时使用。

地图配置文件保存在资源管理服务的`/map/config/`目录下，并以`.json`作为后缀。比如地图的配置文件名称为`default`，则其相对路径为`/map/config/default.json`。完整路径则由`public/config.json`中的`api.file`配置决定（作为前缀），默认为`//assets/file`（反向代理的nginx服务根地址）。

默认的`map.json`配置使用了天地图作为底图，目前`mars3d`自带的key已经失效，需要到[天地图官网](https://console.tianditu.gov.cn/api/statistics)申请新的key，添加到实际的配置文件中：

```json
{
  "method": {
    "token": {
      "tianditu": "44520adb46c57fbe2f09654117f9f236"
    }
  }
}
```

这应该是最简单的解决办法，也可以添加到`basemaps`下的`layers`的`key`数组中，具体参考[mars3d的常见问题说明](http://mars3d.cn/doc.html#issue/token)

### token配置

可以通过配置`public/config.json`的`map.token`设置天地图token:

```json
{
  "map": {
    "token": "44520adb46c57fbe2f09654117f9f236"
  }
}
```

### 备忘

香山站

```json
{
  "center": {
    "lng": 113.214488,
    "lat": 34.396064,
    "alt": 847.1,
    "heading": 0,
    "pitch": -40
  }
}
```

信阳市

```json
{
  "center": {
    "lng": 114.848271,
    "lat": 31.322771,
    "alt": 235383.3,
    "heading": 0,
    "pitch": -72.5
  }
}
```
