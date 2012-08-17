/**
 * 队列
 * 链表实现lpop,lpush,rpush,rpop
 *
 */
(function() {
	var LinkedList = function() {
		this._head = null;
		this._tail = null;
		this._len  = 0;
	};


	if (typeof exports !== 'undefined') { //node
		 module.exports = LinkedList;
	}else{ //browser
		window.LinkedList = LinkedList;
	}
	/**
	 *
	 * @param data {Mixed} 
	 */
	LinkedList.prototype.lpush = function(data) {
		var node;
		node = {
			data: data,
			next: this._head,
			prev: null
		};
		this._head && (this._head.prev = node);
		this._head = node;
		this._tail || (this._tail =  node)
		this._len += 1;
		return this;
	};

	/**
	 * @return the first element
	 */
	LinkedList.prototype.lpop = function() {
		if(this._head == null)
			return null;

		var ret = this._head.data;
		this._head = this._head.next;
		this._head && ( this._head.prev = null)

		this._len -= 1;
		return ret;
	};



	LinkedList.prototype.rpush = function(data) {
		var node;
		node = {
			data: data,
			next: null,
			prev: this._tail
		};
		this._tail && (this._tail.next = node);
		this._tail = node;
		this._head || (this._head =  node)
		this._len += 1;
		return this;
	};

	/**
	 * @return the last element
	 */
	LinkedList.prototype.rpop = function() {
		if(this._tail == null)
			return null;

		var ret = this._tail.data;
		this._tail = this._tail.prev;
		this._tail && ( this._tail.next = null)
		this._len -= 1;
		return ret;
	};

	LinkedList.prototype.size = function() {
		return this._len;
	};

	/**
	 * 按序号返回元素,redis 逻辑
	 * 0,1,..... _len
	 *         -2  -1
	 *  @param idx  -1 last ， 0 ，first
	 */
	LinkedList.prototype.at = function(idx) {
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


	LinkedList.prototype.toArray = function() {
		var current, result;
		result = [];
		current = this._head;
		while (current) {
			result.push(current.data);
			current = current.next;
		}
		return result;
	};

	LinkedList.prototype.toString = function() {
		return this.toArray().toString();
	};


})();

