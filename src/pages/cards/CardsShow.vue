<template>
    <div>
        <div class="grid-container">
            <div v-for="(word, index) in words" :key="index" class="grid-cell">
                <p><strong>Word:</strong> {{ word.english }}</p>
                <p><strong>Pronunciation:</strong> {{ word.pronunciation }}</p>
                <p><strong>Slovak Translation:</strong> {{ word.slovak }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'CardsShow',
    setup() {
        const componentName = 'CardsShow';
		const words = ref([
			{ english: 'cat', pronunciation: 'kæt', slovak: 'mačka' },
			{ english: 'dog', pronunciation: 'dɒɡ', slovak: 'pes' },
			{ english: 'sun', pronunciation: 'sʌn', slovak: 'slnko' },
			{ english: 'book', pronunciation: 'bʊk', slovak: 'kniha' },
			{ english: 'tree', pronunciation: 'triː', slovak: 'strom' },
			{ english: 'house', pronunciation: 'haʊs', slovak: 'dom' },
			{ english: 'water', pronunciation: 'ˈwɔːtə', slovak: 'voda' },
			{ english: 'apple', pronunciation: 'ˈæpl', slovak: 'jablko' },
			{ english: 'chair', pronunciation: 'tʃeə', slovak: 'stolička' },
			{ english: 'bread', pronunciation: 'brɛd', slovak: 'chlieb' },
			{ english: 'car', pronunciation: 'kɑːr', slovak: 'auto' },
			{ english: 'flower', pronunciation: 'ˈflaʊər', slovak: 'kvet' },
			{ english: 'bird', pronunciation: 'bɜːd', slovak: 'vták' },
			{ english: 'fish', pronunciation: 'fɪʃ', slovak: 'ryba' },
			{ english: 'milk', pronunciation: 'mɪlk', slovak: 'mlieko' },
			{ english: 'school', pronunciation: 'skuːl', slovak: 'škola' },
			{ english: 'phone', pronunciation: 'fəʊn', slovak: 'telefón' },
			{ english: 'table', pronunciation: 'ˈteɪbl', slovak: 'stôl' },
			{ english: 'window', pronunciation: 'ˈwɪndəʊ', slovak: 'okno' },
			{ english: 'door', pronunciation: 'dɔːr', slovak: 'dvere' },
			{ english: 'garden', pronunciation: 'ˈɡɑːdn', slovak: 'záhrada' },
			{ english: 'mountain', pronunciation: 'ˈmaʊntən', slovak: 'hora' },
			{ english: 'river', pronunciation: 'ˈrɪvər', slovak: 'rieka' },
			{ english: 'sky', pronunciation: 'skaɪ', slovak: 'nebo' },
			{ english: 'star', pronunciation: 'stɑːr', slovak: 'hviezda' },
			{ english: 'moon', pronunciation: 'muːn', slovak: 'mesiac' },
			{ english: 'train', pronunciation: 'treɪn', slovak: 'vlak' },
			{ english: 'bus', pronunciation: 'bʌs', slovak: 'autobus' },
			{ english: 'road', pronunciation: 'rəʊd', slovak: 'cesta' },
			{ english: 'pen', pronunciation: 'pɛn', slovak: 'pero' }
		]);

        onMounted(() => {
            console.log(`${componentName} mounted`);
        });

        return {
            words
        };
    }
};
</script>

<style scoped>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        max-width: 900px;
        margin: auto;
        }

    .grid-cell {
        background: #fff;
        border: 1px solid #ddd;
        padding: 2rem;
        text-align: center;
        font-size: 1.2rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        transition: box-shadow 0.2s;
    }
</style>