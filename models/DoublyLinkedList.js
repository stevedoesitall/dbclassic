class Node {
	constructor(val) {
		this.val = val
		this.prev = null
		this.next = null
	}
}

class DoublyLinkedList {
	constructor() {
		this.head = null
		this.tail = null
		this.length = 0
	}

	push(val) {
		const newNode = new Node(val)
		if (!this.head) {
			this.head = newNode
			this.tail = this.head
		} else {
			this.tail.next = newNode
			newNode.prev = this.tail
			this.tail = newNode
		}

		this.length++

		return this
	}

	get(val) {
		const listSize = this.length
		let counter = 0
		let myNode
		let currentNode = this.head

		while (!myNode) {
			if (!currentNode) {
				return null
			}
			if (currentNode.val !== val) {
				if (counter === listSize) {
					return false
				}
				currentNode = currentNode.next
				counter++
			} else {
				myNode = currentNode
			}
		}

		return myNode
	}

	createList(arr) {
		arr.forEach((el) => {
			this.push(el)
		})

		return this
	}
}

export default DoublyLinkedList
