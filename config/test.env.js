'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  // 接口地址配置
  BASE_URL: '"http://xxxxx"',
  //ws 服务的地址配置
  WS_BASE_URL:'"ws://xxxx"'
  //cookie 的过期时间
  COOKIE_EXPIRED: 14,
  //cookie 域名
  COOKIE_DOMAIN: '"xxxxx"',
  //cookie 存储前缀
  COOKIE_SUFFIX: '"_TCLOUD_DEV"',
  //企业微信扫码登录的相关配置
  QYWX_APPID: '"xxxx"',
  QYWX_AGENTID: '"xxxx"',
  QYEX_REDIRECT_URI: '"xxxx"'
})
