<template>
    <main>
        <ul class="test__items">
            <li class="test__item">
                <router-link to="/test">Test page</router-link>
            </li>
            <li class="test__item">
                <base-button @click="logoutLocal">base-button click Logout {{ email }}, role {{ role }}</base-button>
                <p>vytvara button</p>
            </li>
            <li class="test__item">
                <base-button class="form-item-button">base-button s class</base-button>
                <p>vytvara button ale pozor specificity, pokial je v css selector len tato class tak to prepise selector
                    button z componentu BaseButton.vue</p>
            </li>
            <li class="test__item">
                <base-button link :to="'/users'">base-button s link :to Users</base-button>
                <p>vytvara a cez RouterLink</p>
            </li>
            <li class="test__item">
                <base-button link :mode="'flat'" :to="'/users'">base-button s link, mode = flat :to Users</base-button>
                <p>vytvara a cez RouterLink</p>
            </li>
            <li class="test__item">
                <base-button link :mode="'outline'" :to="'/users'">base-button s link, mode = outline :to
                    Users</base-button>
                <p>vytvara a cez RouterLink</p>
            </li>
            <li class="test__item">
                <base-button link newTab :to="'/trip/view/print/CFj6hC5HA84OTxZMsfZk'">base-button s link, :to a
                    :newTab
                    <b><i>Users</i></b>
                </base-button>
                <p>vytvara a napriamo</p>
            </li>
            <li class="test__item test__item--cta">
                <a href="/">ciste a home</a>
            </li>
        </ul>
        <p>gdas sdg ddsgag

            gdf
            gapd
            ghds
            h
        </p>

        <div id="lipsum">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum non tempor elit. Duis
                cursus, diam at porttitor molestie, massa diam lobortis ex, sit amet congue urna purus at
                sapien. Maecenas id luctus purus. Sed molestie sagittis diam, eu molestie nulla hendrerit quis.
                Cras porttitor erat vel mi elementum molestie. Suspendisse metus magna, tincidunt nec mauris
                quis, feugiat posuere sapien. Aenean a lorem tincidunt, imperdiet arcu vitae, euismod sapien.
                Curabitur efficitur elit arcu, quis cursus felis elementum vel. Pellentesque maximus malesuada
                urna eget pretium.
            </p>
            <p>
                Nulla facilisi. Suspendisse potenti. Sed a est tortor. Aenean maximus ex sed ante imperdiet
                auctor. Mauris tempor ipsum at nulla sodales sodales. Maecenas et tristique tellus, non
                convallis lorem. Praesent finibus convallis nisl, eu finibus lacus egestas eu. Morbi luctus enim
                sem, ut feugiat purus sollicitudin nec. Ut blandit est id porta dictum. Proin at congue turpis,
                non ornare nibh. Nam id arcu pharetra, dignissim ex sed, bibendum augue. Donec rutrum lobortis
                justo. Nulla et placerat magna. Aenean ante tellus, vestibulum a cursus ac, elementum et orci.
                Integer non nibh sapien. Vivamus quis tristique lacus, vel suscipit turpis.
            </p>
            <p>
                Etiam viverra ipsum ipsum. Morbi aliquet arcu ut eros semper tristique. Duis euismod scelerisque
                nunc, posuere aliquet metus egestas vel. Nunc hendrerit in nulla sed posuere. Sed facilisis
                luctus leo id porta. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
                inceptos himenaeos. Nunc sollicitudin nibh at lorem ultricies pulvinar. Quisque sagittis arcu in
                ullamcorper placerat. Fusce facilisis libero ac neque aliquam, id venenatis eros rutrum. Fusce
                egestas erat turpis, vel hendrerit sem suscipit et. Mauris euismod quam non lorem faucibus
                posuere. Vestibulum nec erat quis nisi dictum dictum a id magna.
            </p>
            <p>
                Integer egestas ornare elit vel luctus. Vestibulum eleifend tempor velit ut tincidunt. Nam at
                rhoncus diam. Proin bibendum ipsum vel tortor semper pellentesque sed eget dui. Sed ultrices
                lorem eget dictum mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                venenatis ipsum nunc, efficitur egestas dolor pretium id. Aenean eu libero finibus, rhoncus
                risus vitae, convallis sapien. Vivamus tortor ligula, bibendum congue lectus sodales, euismod
                porta mauris. Sed iaculis massa leo, quis lacinia sapien ornare ut. Ut arcu ipsum, mollis id
                libero at, vestibulum feugiat elit.
            </p>
            <p>
                Sed eu diam id sapien malesuada volutpat id vel ligula. Nulla interdum felis est, vel blandit
                tellus imperdiet vel. Nullam hendrerit urna mi, eu bibendum magna consectetur nec. Morbi dapibus
                ultrices justo at semper. Nunc scelerisque nisl in molestie interdum. Suspendisse vel mattis
                massa, ac pretium nisi. Donec euismod urna non molestie ullamcorper. Nulla tincidunt massa
                tellus, in tempor eros convallis non. Cras odio tellus, cursus ut augue ut, placerat
                pellentesque elit.
            </p>
        </div>
        <!-- <base-card>
            <div class="content-container">
                <h2>Welcome!</h2>
                <img src="/img/tulipR.svg" alt="Logo" />
            </div>
        </base-card> -->
    </main>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: 'TestPageLinky',
    setup() {
        const componentName = 'TestPageLinky';
        const store = useStore();
        const router = useRouter();

        const email = computed(() => store.getters.email);
        const role = computed(() => store.getters.role);

        async function logoutLocal() {
            try {
                await store.dispatch('logout');
                router.replace('/');
            } catch (error) {
                console.error(`Extra error, Component ${componentName}, ERROR: ${error.message}`);
            }
        }

        return {
            componentName,
            email,
            role,
            logoutLocal
        };
    }
};
</script>

<style>
    li button.form-item-button {
        justify-self: center;
        align-self: center;
        background-color: rgb(255, 0, 242);
        width: 40%;
        height: 2rem;
        padding: 5px;
    }

    .test__items {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .test__item {
        margin: 0 1rem;
    }

    .content-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
