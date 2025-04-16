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
        <!-- <base-card>
            <div class="content-container">
                <h2>Welcome!</h2>
                <img src="/img/tulipR.svg" alt="Logo" />
            </div>
        </base-card> -->
    </main>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'TestPage',
    data() {
        return {
            mobileNavOpened: false
        };
    },
    computed: {
        ...mapGetters([
            'email',
            'role'
        ])
    },
    methods: {
        ...mapActions({
            logout: 'logout',
        }),
        logoutLocal() {
            try {
                this.logout();
                this.$router.replace('/');
            } catch (error) {
                console.error(`Extra error, Component ${this.$options.name}, ERROR: ${error.message}`);
                //this.$loadErrorMessage(this.$options.name, error);
            }
        },
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