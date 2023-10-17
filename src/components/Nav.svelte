<script>
    import { page } from '$app/stores';
</script>

<nav class="p-1 bg-black mb-1 grid grid-flow-col auto-cols-max gap-x-1">
    <a class="{$page.route.id == '/' ? 'underline text-red-500' : 'text-white'}" href="/">Home</a>
    <a class="{$page.route.id == '/catalog' ? 'underline text-red-500' : 'text-white'}" href="/catalog">Catalog</a>
    <a class="{$page.route.id == '/debug' ? 'underline text-red-500' : 'text-white'}" href="/debug">Debug</a>
</nav>