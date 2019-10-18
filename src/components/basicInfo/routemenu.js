let menu = {
  id: "icon-basic-data",
  menuTitle: "基础信息",
  menuPath: "",
  menuIcon: "icon-basic-data",
  children: [
    {
      menuTitle: "仓库信息",
      menuPath: "",
      children: [
        {
          id:'basic-searchInfo',
          menuTitle: "仓库信息查询",
          menuPath: "searchInfo"
        },
        {
          id:'basic-wareHouse',
          menuTitle: "仓区维护",
          menuPath: "wareHouse"
        },
        {
          id:'basic-libManagement',
          menuTitle: "库区维护",
          menuPath: "libManagement"
        }
      ]
    },
    {
      menuTitle: "线体管理",
      menuPath: "",
      children: [
        {
          id:'basic-lineTaskSearch',
          menuTitle: "线体任务查询",
          menuPath: "lineTaskSearch"
        },
        {
          id:'basic-lineSweepRecord',
          menuTitle: "线体扫描查询",
          menuPath: "lineSweepRecord"
        },
        {
          id:'basic-lineStatus',
          menuTitle: "线体设备状态",
          menuPath: "lineStatus"
        }
      ]
    },
    {
      menuTitle: "包材管理",
      menuPath: "",
      children: [
        {
          id:'basic-packagingInfo',
          menuTitle: "包材资料",
          menuPath: "packagingInfo"
        },
        {
          id:'basic-packagingStore',
          menuTitle: "包材库存",
          menuPath: "packagingStore"
        }
      ]
    }
  ]
}
  
  export { menu }