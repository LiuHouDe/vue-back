<template>
    <h3>Not Found</h3>
    <div>
        <RouterLink class="btn btn-primary" :to="{ name: 'index-link' }">回首頁</RouterLink>
    </div>    
</template>
<script>
export default {
    mounted: function() {
        console.log("notfound mounted")
    }
}
</script>
<style scoped>
</style>