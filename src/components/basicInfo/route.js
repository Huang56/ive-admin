const router = [{
		path: 'searchInfo',
		name: 'searchInfo',
		component: (r) => require(['./warehouseInfo/searchInfo/index'], r),
		meta: {
			title: '仓库查询',
			keepAlive: true
		}
	},
	{
		path: 'wareHouse',
		name: 'wareHouse',
		component: (r) => require(['./warehouseInfo/wareHouse/wareHouse'], r),
		meta: {
			title: '仓区维护',
			keepAlive: true
		}
	},
	{
		path: 'libManagement',
		name: 'libManagement',
		component: (r) => require(['./warehouseInfo/libManagement/index'], r),
		meta: {
			title: '库区维护',
			keepAlive: true
		}
	},
	{

		path: 'lineTaskSearch',
		name: 'lineTaskSearch',
		component: (r) => require(['./lineManagement/lineTaskSearch/index'], r),
		meta: {
			title: '线体任务查询',
			keepAlive: true
		}
	},
	{
		path: 'lineSweepRecord',
		name: 'lineSweepRecord',
		component: (r) => require(['./lineManagement/lineSweepRecord/lineSweepRecord'], r),
		meta: {
			title: '线体扫描查询',
			keepAlive: true
		}
	},
	{
		path: 'lineStatus',
		name: 'lineStatus',
		component: (r) => require(['./lineManagement/lineStatus/lineStatus'], r),
		meta: {
			title: '线体设备状态',
			keepAlive: true
		}
	},
	{
		path: 'packagingInfo',
		name: 'packagingInfo',
		component: (r) => require(['./packaging/packagingInfo/packagingInfo'], r),
		meta: {
			title: '包材资料',
			keepAlive: true
		}
	}, {
		path: 'packagingStore',
		name: 'packagingStore',
		component: (r) => require(['./packaging/packagingStore/packagingStore'], r),
		meta: {
			title: '包材库存',
			keepAlive: true
		}
	}
]

export {
	router
}
