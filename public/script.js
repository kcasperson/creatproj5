var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
  },
  created: function() {
    this.getItems();
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	       return !item.archived;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	     return this.items.filter(function(item) {
    	  return !item.archived;
    	});
      if (this.show === 'archived')
	     return this.items.filter(function(item) {
    	  return item.archived;
    	});
      if (this.show === 'home') {
        let home=[];
        this.items.forEach(function(item) {
          if(item.type===1) home.push(item);
        });

        return home;
      }
      if (this.show === 'school') {
        let school=[];
        this.items.forEach(function(item) {
          if(item.type===2) school.push(item);
        });

        return school;
      }
      if (this.show === 'work') {
        let work=[];
        this.items.forEach(function(item) {
          if(item.type===3) work.push(item);
        });

        return work;
      }
      if (this.show === 'ordered') {
        let home=[];
        let school=[];
        let work=[];
        this.items.forEach(function(item) {
          if(item.type===1) home.push(item);
          else if (item.type===2) school.push(item);
          else work.push(item);
        });

        return work.concat(school).concat(home);
      }

      return this.items;
    },
  },
  methods: {
    getItems: function() {
      axios.get("/api/items").then(response => {
      	this.items = response.data;
      	return true;
      }).catch(err => {
      });
    },
    addItem: function() {
      axios.post("/api/items", {
      	text: this.text,
      	archived: false,
        type: this.type
      }).then(response => {
      	this.text = "";
      	this.getItems();
        this.type="";
      	return true;
      }).catch(err => {
      });
    },
    archiveItem: function(item) {
      axios.put("/api/items/" + item.id, {
      	text: item.text,
      	archived: !item.archived,
      	orderChange: false,
      }).then(response => {
      	return true;
      }).catch(err => {
      });
    },
    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
        	this.getItems();
        	return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    showHome: function() {
      this.show = 'home';
    },
    showSchool: function() {
      this.show = 'school';
    },
    showWork: function() {
      this.show = 'work';
    },
    showActive: function() {
      this.show = 'active';
    },
    showArchived: function() {
      this.show = 'archived';
    },
    deletearchived: function() {
      this.items.forEach(item => {
    	if (item.archived)
    	  this.deleteItem(item)
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
      	text: this.drag.text,
      	archived: this.drag.archived,
      	orderChange: true,
      	orderTarget: item.id
      }).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
    },

  }
});
