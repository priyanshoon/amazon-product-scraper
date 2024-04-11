<template>
    <div>
        <h1>Amazon Product Scraper</h1>
        <br>
        <small>Search Items</small>
        <br>
        <input v-model="term" types="text" placeholder="Insert a search term">
        <button @click="start()">Submit</button>
        <br><br>
        <h5 v-for="term of terms"> {{term}} </h5>
        <table style="border:1px solid black">
            <tr>
                <th style="border:1px solid black">Name</th>
                <th style="border:1px solid black">Stars</th>
                <th style="border:1px solid black">Price</th>
                <th style="border:1px solid black">URL</th>
            </tr>
            <tr v-for="result of results">
                <td style="border:1px solid black">{{ result.name }}</td>
                <td style="border:1px solid black">{{ result.stars }}</td>
                <td style="border:1px solid black">{{ result.price }}</td>
                <td style="border:1px solid black">{{ result.url }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                term: "",
                results: []
            }
        },
        methods: {
            start() {
                fetch("/api/scrapper", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        term: this.term,
                    }),
                }).then((response) => response.json()).then((scrape) => {
                        this.results = scrape.result
                    })
            }
        }
    }
</script>
