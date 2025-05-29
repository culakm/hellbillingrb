<template>
	<footer class="main-footer">
		<nav>
			<ul class="main-footer__links">
				<li class="main-footer__link">
					<a href="#">Support</a>
				</li>
				<li class="main-footer__link">
					<a href="#">Terms of Use</a>
				</li>
			</ul>
		</nav>
	</footer>
</template>

<style scoped>
	.main-footer {
		background: #344a60;
		padding: 2rem;
		margin: 0;
		grid-area: footer;
	}

	.main-footer__links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.main-footer__link {
		margin: 0.5rem 0;
	}

	.main-footer__link a {
		color: white;
		text-decoration: none;
	}

	.main-footer__link a:hover,
	.main-footer__link a:active {
		color: #ccc;
	}

	.mobile-nav {
		display: none;
		position: fixed;
		z-index: 101;
		top: 0;
		right: 0;
		background: #344a60;
		width: 40%;
		height: 100vh;
	}

	.mobile-nav__items {
		width: 90%;
		height: 100%;
		list-style: none;
		margin: 0 auto;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.mobile-nav__item {
		margin: 1rem 0;
	}

	.mobile-nav__item a {
		font-size: 1.5rem;
	}

	@media (min-width: 46rem) {
		.main-footer__link {
			margin: 0 1rem;
		}

		.main-footer__links {
			flex-direction: row;
			justify-content: center;
		}
	}
</style>