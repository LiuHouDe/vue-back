<template>
    <div class="footer-banner">
        &copy; 2024 Starbust Cinema. All rights reserved.
    </div>
</template>

<script>
export default {
    name: "FooterBanner"
};
</script>

<style scoped>
.footer-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #333;
    color: white;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    z-index: 1000;
}
</style>