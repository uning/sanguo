/**
 * 队列,带map
 * 链表实现lpop,lpush,rpush,rpop
 *
 *
 */
(function() {
	var MapLinkedList = function() {
		this._head = null;
		this._tail = null;
		this._len  = 0;
		this._maps = {};
	};


	if (typeof exports !== 'undefined') { //node
		 module.exports = MapLinkedList;
	}else{ //browser
		window.MapLinkedList = MapLinkedList;
	}
	
	/**
	 * 获取数据
	 */
	MapLinkedList.prototype.get = function(key){
		if( key in this._maps){
			return this._maps[key].data;
		}
	}
	/**
	 * 获取数据,并移动到队列头部
	 */
	MapLinkedList.prototype.getr = function(key){
		if( key in this._maps){
			var node =  this._maps[key];
			if(node !== this._head)
				this.lpush(node);
			return node.data;
		}
	}

	/**
	 * 从数据结构里移除 node
	 *
	 */
	MapLinkedList.prototype.removeNode = function(node,del){
		var next = node.next,prev = node.prev
		if(prev)
			prev.next = next;
		if(next)
			next.prev = prev;
		this._len -= 1;

		if(this._head === node){
			next && ( next.prev = null)
			this._head = next;
		}
		if(this._tail === node){
			prev && ( prev.next = null)
			this._tail = prev;
		}
		if(del)
			delete this._maps[node.key]

		return node; 
	}

	/**
	 * 从list移除
	 */
	MapLinkedList.prototype.removeList = function(key){
		if( key in this._maps){
			return this.removeNode(this._maps[key]);
		}
		return null;
	}

	/**
	 * 从list和map移除
	 *
	 */
	MapLinkedList.prototype.removeListAndMap = function(key){
		var ret = this.removeList(key)
		if(ret){
			delete this._maps[key];
			return ret.data
		}
	}

	/**
	 * 前插一项数据
	 * @param key  {Mixed} 为 removeList
	 * @param data {Mixed} 
	 */
	MapLinkedList.prototype.lpush = function(key,data) {
		var node;
		if(!data) node = key;

		if(!node)
			node = this.removeList(key)  
		else
			this.removeNode(node);

		if(!node){
			this._maps[key] = node = {
				data: data,
				key:key
			};
		}
		node.next = this._head;
		node.prev = null;

		this._len += 1;
		this._head && (this._head.prev = node);
		this._head = node;
		this._tail || (this._tail =  node)
		return this;
	};

	/**
	 * @return the first element
	 */
	MapLinkedList.prototype.lpop = function() {
		if(this._head == null)
			return null;
		var ret = this._head;
		this.removeNode(ret,true);
		return ret;
	};



	MapLinkedList.prototype.rpush = function(key,data) {
		var node;
		if(!data) node = key;
		if(!node)
			node = this.removeList(key)  
		else
			this.removeNode(node);
		if(!node){
			this._maps[key] = node = {
				data: data,
				key:key,
				next: null,
				prev: this._tail
			};
		}
		node.next = null;
		node.prev = this._tail;

		this._tail && (this._tail.next = node);
		this._tail = node;
		this._head || (this._head =  node)
		this._len += 1;
		return this;
	};

	/**
	 * @return the last element
	 */
	MapLinkedList.prototype.rpop = function() {
		if(this._tail == null)
			return null;

		var ret = this._tail;
		this.removeNode(ret,true);
		return ret;
	};

	MapLinkedList.prototype.size = function() {
		return this._len;
	};

	/**
	 * 按序号返回元素,redis 逻辑
	 * 0,1,..... _len
	 *         -2  -1
	 *  @param idx  -1 last ， 0 ，first
	 */
	MapLinkedList.prototype.at = function(idx) {
		var current = this._head;
		idx = idx || 0;
		if(idx < 0)
			current = this._tail;
		while (idx < -1 && current){
			idx += 1;
			current = current.prev;
		}
		while (idx > 0 && current){
			idx -= 1;
			current = current.next;
		}
		//console.log(current,this._head,this._tail);
		return current && current.data;
	}


	MapLinkedList.prototype.toArray = function() {
		var current, result;
		result = [];
		current = this._head;
		while (current) {
			result.push(current.data);
			current = current.next;
		}
		return result;
	};

	MapLinkedList.prototype.toString = function() {
		return this.toArray().toString();
	};


})();

