var SENOR_ENV_VARS = [
  {
    address: 'https://apiup-cf.cbfes.com/sa?project=default',
    allowSites: ['025', '2558', '2728', '032', '1166']
  },
  {
    address: 'https://apiup-cf.cbfes.com/sa?project=production',
    allowSites: [
      '230',
      '250',
      '296',
      '702',
      '326',
      '722',
      '500',
      '5033',
      '6275',
      '6276',
      '1071',
      '1056',
      '663',
      '5228',
      '5073',
      '5021',
      '5091',
      '5050',
      '5235',
      '602',
      '5012',
      '5119',
      '6332',
      '373',
      '6822'
    ]
  }
]

if (
  window.LOBBY_SITE_CONFIG &&
  window.LOBBY_SITE_CONFIG.INJECT_DATA &&
  window.LOBBY_SITE_CONFIG.INJECT_DATA.apiGetSiteInfo &&
  window.LOBBY_SITE_CONFIG.INJECT_DATA.apiGetSiteInfo.data &&
  window.LOBBY_SITE_CONFIG.INJECT_DATA.apiGetSiteInfo.data.data &&
  window.LOBBY_SITE_CONFIG.INJECT_DATA.apiGetSiteInfo.data.data
    .vestBagJumpConfig &&
  window.LOBBY_SITE_CONFIG.INJECT_DATA.apiGetSiteInfo.data.data.vestBagJumpConfig.find(
    function (el) {
      return el.packageName == 'wg.sensors.on'
    }
  )
) {
  SENOR_ENV_VARS[1].allowSites.push(
    window.LOBBY_SITE_CONFIG.INJECT_DATA.apiGetSiteInfo.data.data.siteCode
  )
}

var currentSensors = SENOR_ENV_VARS.find(function (el) {
  return el.allowSites.includes(
    window.LOBBY_SITE_CONFIG.INJECT_DATA.apiGetSiteInfo.data.data.siteCode
  )
})

if (currentSensors) {
  importSensorScript()
}

/** setup script */
function importSensorScript() {
  console.log('Sensors:')
  var script = document.createElement('script')
  script.id = 'script-Sensors'
  script.defer = true
  script.onload = function () {
    onSensorsloaded()
  }
  script.src = '/libs/monitor/sensorsdata.min.js'
  document.head.appendChild(script)
}

function onSensorsloaded() {
  var sensors = window['sensorsDataAnalytic201505']
  sensors.init({
    server_url: currentSensors ? currentSensors.address : '',
    is_track_single_page: true,
    use_client_time: true,
    send_type: 'beacon',
    heatmap: {
      clickmap: 'default',
      scroll_notice_map: 'not_collect'
    }
  })
  sensors.track('htmlStart')
}
