<template>
	<keep-alive :include='secKeepAliveComponents'>
		<router-view></router-view>
	</keep-alive>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'lineManagement',
	data () {
		return {}
	},
	computed: {
    ...mapState({
      secKeepAliveComponents: 'secKeepAliveComponents'
    })
  },
}
</script>