<template>
	<form @submit.prevent="submitForm">
		<div class="form-control" :class="{ invalid: !name.isValid }">
			<label for="name">Name</label>
			<input type="text" id="name" v-model.trim="name.val" @blur="clearValidity('name')" />
			<p v-if="!name.isValid">name must not be empty!</p>
		</div>
		<div class="form-control" :class="{ invalid: !email.isValid }">
			<label for="email">Email</label>
			<input type="text" id="email" v-model.trim="email.val" @blur="clearValidity('email')" />
			<p v-if="!email.isValid">email must not be empty!</p>
		</div>
		<div class="form-control" :class="{ invalid: !password1.isValid }">
			<label for="password1">Password</label>
			<input type="password" autocomplete="new-password" id="password1" v-model.trim="password1.val"
				@blur="clearValidity('password1')" />
			<p v-if="!password1.isValid">password must not be empty!</p>
		</div>
		<div class="form-control" :class="{ invalid: !password2.isValid }">
			<label for="password2">Confirm Password</label>
			<input type="password" id="password2" v-model.trim="password2.val" @blur="clearValidity('password2')" />
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
	data() {
		return {
			name: {
				val: '',
				isValid: true
			},
			email: {
				val: '',
				isValid: true
			},
			password1: {
				val: '',
				isValid: true
			},
			password2: {
				val: '',
				isValid: true
			},
			description: {
				val: '',
				isValid: true
			},
			role: {
				val: 'user',
				isValid: true
			},

			userId: '',
			formIsValid: true,
			passwordMatch: true,
		};
	},
	async created() {
		if (this.user.userId) {
			this.userId = this.user.userId
		}

		this.name.val = this.user.name || '';
		this.description.val = this.user.description || '';
		this.email.val = this.user.email || '';
		this.role.val = this.user.role || 'user';
	},
	computed: {
		isEdit() {
			return !!this.user.userId;
		},
	},
	methods: {
		clearValidity(input) {
			this[input].isValid = true;
		},
		validateForm() {
			this.formIsValid = true;
			if (this.name.val === '') {
				this.name.isValid = false;
				this.formIsValid = false;
			}
			if (this.email.val === '') {
				this.email.isValid = false;
				this.formIsValid = false;
			}
			if (!this.isEdit) {
				if (this.password1.val === '') {
					this.password1.isValid = false;
					this.formIsValid = false;
				}
				if (this.password2.val === '') {
					this.password2.isValid = false;
					this.formIsValid = false;
				}
				if (this.password1.val !== this.password2.val) {
					this.passwordMatch = false;
					this.formIsValid = false;
				}
			}
			else {
				if ((this.password1 || this.password2) && (this.password1.val !== this.password2.val)) {
					this.passwordMatch = false;
					this.formIsValid = false;
				}
			}

		},
		submitForm() {
			this.validateForm();
			if (!this.formIsValid) return;

			const formData = {
				userId: this.userId,
				name: this.name.val,
				email: this.email.val,
				password: this.password1.val,
				description: this.description.val,
				role: this.role.val,
			};
			this.$emit('save-data', formData);
		},
	},
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