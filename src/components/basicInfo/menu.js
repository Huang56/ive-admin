let menu = {
  menuTitle: '基础信息',
  menuPath: '',
  menuIcon: 'icon-basic-data',
  children: [
    {
      menuTitle: '仓库信息',
      menuPath: '',
      children: [
        {
          menuTitle: '仓库信息查询',
          menuPath: 'searchInfo'
        },
        {
          menuTitle: '仓区维护',
          menuPath: 'wareHouse'
        },
        {
          menuTitle: '库区维护',
          menuPath: 'libManagement'
        },
      ]
    },
    {
      menuTitle: '线体管理',
      menuPath: '',
      children: [
        {
          menuTitle: '线体任务查询',
          menuPath: 'lineTaskSearch'
        },
        {
          menuTitle: '线体扫描查询',
          menuPath: 'lineSweepRecord'
        },
        {
          menuTitle: '线体设备状态',
          menuPath: 'lineStatus'
        },
      ]
    },
    {
      menuTitle: '包材管理',
      menuPath: '',
      children: [
        {
          menuTitle: '包材资料',
          menuPath: 'packagingInfo'
        },
        {
          menuTitle: '包材库存',
          menuPath: 'packagingStore'
        }
      ]
    },
  ]
}

export { menu }