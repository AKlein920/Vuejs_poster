var loadNum = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: 9.99
  },
  computed: {
    noMoreItems: function() {
      return this.items.length === this.results.length && this.results.length > 0;
    }
  },
  methods: {
    appendItems: function() {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + loadNum);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if (this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http
        .get('/search/'.concat(this.newSearch))
        .then(function(res) {
          console.log(res.data);
          this.results = res.data;
          this.appendItems();
          this.lastSearch = this.newSearch;
          this.loading = false;
        });
      } else {
        alert('Search for something!');
      }

    },
    addItem: function(index) {
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: 9.99
        });
      }
      this.total += 9.99;
    },
    inc: function(item) {
      item.qty++;
      this.total += 9.99;
    },
    dec: function(item) {
      item.qty --;
      this.total -= 9.99;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function(price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function() {
    this.onSubmit();
    var that = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      that.appendItems();
    });
  }
});
