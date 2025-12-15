<template>
    <form @submit.prevent="submitForm">
        <div class="form-control" :class="{ invalid: !name.isValid }">
            <label for="name">Name</label>
            <input type="text" autocomplete="off" id="name" v-model.trim="name.val" @blur="clearValidity('name')" />
            <p v-if="!name.isValid">name must not be empty!</p>
        </div>
        <div class="form-control" :class="{ invalid: !email.isValid }">
            <label for="email">Email</label>
            <input type="text" autocomplete="off" id="email" v-model.trim="email.val" @blur="clearValidity('email')" />
            <p v-if="!email.isValid">email must not be empty!</p>
        </div>
        <div class="form-control" :class="{ invalid: !password1.isValid }">
            <label for="password1">Password</label>
            <input type="password" autocomplete="off" id="password1" v-model.trim="password1.val"
                @blur="clearValidity('password1')" />
            <p v-if="!password1.isValid">password must not be empty!</p>
        </div>
        <div class="form-control" :class="{ invalid: !password2.isValid }">
            <label for="password2">Confirm Password</label>
            <input type="password" autocomplete="off" id="password2" v-model.trim="password2.val" @blur="clearValidity('password2')" />
            <p v-if="!password2.isValid">password must not be empty!</p>
            <p v-if="!passwordMatch">Passwords must match!</p>
        </div>
        <div class="form-control" :class="{ invalid: !description.isValid }">
            <label for="description">Description</label>
            <textarea id="description" rows="5" v-model.trim="description.val"
                @blur="clearValidity('description')"></textarea>
            <p v-if="!description.isValid">Description must not be empty!</p>
        </div>
        <div class="form-control" :class="{ invalid: !role.isValid }">
            <label for="role">Role</label>
            <select id="role" v-model="role.val" @blur="clearValidity('role')">
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">User</option>
            </select>
            <p v-if="!role.isValid">Role must be selected!</p>
        </div>

        <p v-if="!formIsValid">Please fix errors</p>
        <base-button v-if="Object.keys(user).length === 0">Add User</base-button>
        <base-button v-else>Save User</base-button>
    </form>
</template>

<script>
import { ref, toRef, onMounted } from 'vue';

export default {
    name: 'UserForm',
    emits: ['save-data'],
    props: {
        user: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    },
    setup(props, { emit }) {
        const componentName = 'UserForm';

        // Form fields with validation state
        const name = ref({ val: '', isValid: true });
        const email = ref({ val: '', isValid: true });
        const password1 = ref({ val: '', isValid: true });
        const password2 = ref({ val: '', isValid: true });
        const description = ref({ val: '', isValid: true });
        const role = ref({ val: 'user', isValid: true });

        let userId = '';
        const formIsValid = ref(true);
        const passwordMatch = ref(true);

        // Detect edit mode
        const isEdit = !!props.user.userId;

        // Initialize form fields if editing
        onMounted(async () => {
            if (props.user.userId) {
                userId = props.user.userId;
            }
            name.value.val = props.user.name || '';
            description.value.val = props.user.description || '';
            email.value.val = props.user.email || '';
            role.value.val = props.user.role || 'user';
        });

        // Reset validity when input is blurred
        function clearValidity(input) {
            switch (input) {
                case 'name':
                    name.value.isValid = true;
                    break;
                case 'email':
                    email.value.isValid = true;
                    break;
                case 'password1':
                    password1.value.isValid = true;
                    break;
                case 'password2':
                    password2.value.isValid = true;
                    break;
                case 'description':
                    description.value.isValid = true;
                    break;
                case 'role':
                    role.value.isValid = true;
                    break;
            }
        }

        function validateForm() {
            formIsValid.value = true;
            passwordMatch.value = true;

            if (name.value.val === '') {
                name.value.isValid = false;
                formIsValid.value = false;
            }
            if (email.value.val === '') {
                email.value.isValid = false;
                formIsValid.value = false;
            }
            if (!isEdit) {
                if (password1.value.val === '') {
                    password1.value.isValid = false;
                    formIsValid.value = false;
                }
                if (password2.value.val === '') {
                    password2.value.isValid = false;
                    formIsValid.value = false;
                }
                if (password1.value.val !== password2.value.val) {
                    passwordMatch.value = false;
                    formIsValid.value = false;
                }
            } else {
                // In edit mode, only check if passwords are provided and must match
                if ((password1.value.val || password2.value.val) && (password1.value.val !== password2.value.val)) {
                    passwordMatch.value = false;
                    formIsValid.value = false;
                }
            }
            if (description.value.val === '') {
                description.value.isValid = false;
                formIsValid.value = false;
            }
            if (!role.value.val) {
                role.value.isValid = false;
                formIsValid.value = false;
            }
        }

        function submitForm() {
            validateForm();
            if (!formIsValid.value) return;

			const userData = {
				userId: userId,
				name: name.value?.val,
				email: email.value?.val,
				password: password1.value?.val,
				description: description.value?.val,
				role: role.value?.val,
			};
			emit('save-data', userData);
        }

        return {
            componentName,
            name,
            email,
            password1,
            password2,
            description,
            role,
            formIsValid,
            passwordMatch,
            clearValidity,
            validateForm,
            submitForm,
			user: toRef(props, 'user'),
        };
    }
};
</script>

<style scoped>
    .form-control {
        margin: 0.5rem 0;
    }

    label {
        font-weight: bold;
        display: block;
        margin-bottom: 0.5rem;
    }

    input[type='checkbox']+label {
        font-weight: normal;
        display: inline;
        margin: 0 0 0 0.5rem;
    }

    input,
    textarea {
        display: block;
        width: 100%;
        border: 1px solid #ccc;
        font: inherit;
    }

    input:focus,
    textarea:focus {
        background-color: #f0e6fd;
        outline: none;
        border-color: #3d008d;
    }

    input[type='checkbox'] {
        display: inline;
        width: auto;
        border: none;
    }

    input[type='checkbox']:focus {
        outline: #3d008d solid 1px;
    }

    .invalid label {
        color: red;
    }

    .invalid input,
    .invalid textarea {
        border: 1px solid red;
    }
</style>
