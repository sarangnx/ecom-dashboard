<template>
    <div>
        This thing is never rendered. But is required. Otherwise a render error is thrown by vue, when it cannot find a
        template tag.
    </div>
</template>
<script>
export default {
    name: 'Logout',
    created() {
        this.$store.dispatch('auth/logout');
        this.$router.push('/login');
    },
};
</script>
