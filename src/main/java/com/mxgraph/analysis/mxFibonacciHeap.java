/**
 * Copyright (c) 2007-2017, Gaudenz Alder
 * Copyright (c) 2007-2017, JGraph Ltd
 */
package com.mxgraph.analysis;

import java.util.Hashtable;
import java.util.Map;

/**
 * This class implements a priority queue.
 */
public class mxFibonacciHeap
{

	/**
	 * Maps from elements to nodes
	 */
	protected Map<Object, Node> nodes = new Hashtable<Object, Node>();

	/**
	 * 
	 */
	protected Node min;

	/**
	 * 
	 */
	protected int size;

	/**
	 * Returns the node that represents element.
	 * @param element the element whose node to find
	 * @param create whether to create 
	 * @return the node representing the specified element
	 */
	public Node getNode(Object element, boolean create)
	{
		Node node = nodes.get(element);

		if (node == null && create)
		{
			node = new Node(element, Double.MAX_VALUE);
			nodes.put(element, node);
			insert(node, node.getKey());
		}
		return node;
	}

	/**
	 * Returns true if the queue is empty.
	 * @return whether the queue is empty
	 */
	public boolean isEmpty()
	{
		return min == null;
	}

	/**
	 * Decreases the key value for a heap node, given the new value to take on.
	 * The structure of the heap may be changed and will not be consolidated.
	 * 
	 * <p>
	 * Running time: O(1) amortized
	 * </p>
	 * 
	 * @param x Node whose value should be decreased.
	 * @param k New key value for node x.
	 * 
	 * @exception IllegalArgumentException
	 *                Thrown if k is larger than x.key value.
	 */
	public void decreaseKey(Node x, double k)
	{
		if (k > x.key)
		{
			throw new IllegalArgumentException(
					"decreaseKey() got larger key value");
		}

		x.key = k;
		Node y = x.parent;

		if ((y != null) && (x.key < y.key))
		{
			cut(x, y);
			cascadingCut(y);
		}

		if (min == null || x.key < min.key)
		{
			min = x;
		}
	}

	/**
	 * Deletes a node from the heap given the reference to the node. The trees
	 * in the heap will be consolidated, if necessary. This operation may fail
	 * to remove the correct element if there are nodes with key value
	 * -Infinity.
	 * 
	 * <p>
	 * Running time: O(log n) amortized
	 * </p>
	 * 
	 * @param x The node to remove from the heap.
	 */
	public void delete(Node x)
	{
		// make x as small as possible
		decreaseKey(x, Double.NEGATIVE_INFINITY);

		// remove the smallest, which decreases n also
		removeMin();
	}

	/**
	 * Inserts a new data element into the heap. No heap consolidation is
	 * performed at this time, the new node is simply inserted into the root
	 * list of this heap.
	 * 
	 * <p>
	 * Running time: O(1) actual
	 * </p>
	 * 
	 * @param node
	 *            new node to insert into heap
	 * @param key
	 *            key value associated with data object
	 */
	public void insert(Node node, double key)
	{
		node.key = key;

		// concatenate node into min list
		if (min != null)
		{
			node.left = min;
			node.right = min.right;
			min.right = node;
			node.right.left = node;

			if (key < min.key)
			{
				min = node;
			}
		}
		else
		{
			min = node;
		}

		size++;
	}

	/**
	 * Returns the smallest element in the heap. This smallest element is the
	 * one with the minimum key value.
	 * 
	 * <p>
	 * Running time: O(1) actual
	 * </p>
	 * 
	 * @return Returns the heap node with the smallest key.
	 */
	public Node min()
	{
		return min;
	}

	/**
	 * Removes the smallest element from the heap. This will cause the trees in
	 * the heap to be consolidated, if necessary.
	 * Does not remove the data node so that the current key remains stored.
	 * 
	 * <p>
	 * Running time: O(log n) amortized
	 * </p>
	 * 
	 * @return Returns the node with the smallest key.
	 */
	public Node removeMin()
	{
		Node z = min;

		if (z != null)
		{
			int numKids = z.degree;
			Node x = z.child;
			Node tempRight;

			// for each child of z do...
			while (numKids > 0)
			{
				tempRight = x.right;

				// remove x from child list
				x.left.right = x.right;
				x.right.left = x.left;

				// add x to root list of heap
				x.left = min;
				x.right = min.right;
				min.right = x;
				x.right.left = x;

				// set parent[x] to null
				x.parent = null;
				x = tempRight;
				numKids--;
			}

			// remove z from root list of heap
			z.left.right = z.right;
			z.right.left = z.left;

			if (z == z.right)
			{
				min = null;
			}
			else
			{
				min = z.right;
				consolidate();
			}

			// decrement size of heap
			size--;
		}

		return z;
	}

	/**
	 * Returns the size of the heap which is measured in the number of elements
	 * contained in the heap.
	 * 
	 * <p>
	 * Running time: O(1) actual
	 * </p>
	 * 
	 * @return Returns the number of elements in the heap.
	 */
	public int size()
	{
		return size;
	}

	/**
	 * Joins two Fibonacci heaps into a new one. No heap consolidation is
	 * performed at this time. The two root lists are simply joined together.
	 * 
	 * <p>
	 * Running time: O(1) actual
	 * </p>
	 * 
	 * @param h1 The first heap.
	 * @param h2 The second heap.
	 * @return Returns a new heap containing h1 and h2.
	 */
	public static mxFibonacciHeap union(mxFibonacciHeap h1, mxFibonacciHeap h2)
	{
		mxFibonacciHeap h = new mxFibonacciHeap();

		if ((h1 != null) && (h2 != null))
		{
			h.min = h1.min;

			if (h.min != null)
			{
				if (h2.min != null)
				{
					h.min.right.left = h2.min.left;
					h2.min.left.right = h.min.right;
					h.min.right = h2.min;
					h2.min.left = h.min;

					if (h2.min.key < h1.min.key)
					{
						h.min = h2.min;
					}
				}
			}
			else
			{
				h.min = h2.min;
			}

			h.size = h1.size + h2.size;
		}

		return h;
	}

	/**
	 * Performs a cascading cut operation. This cuts y from its parent and then
	 * does the same for its parent, and so on up the tree.
	 * 
	 * <p>
	 * Running time: O(log n); O(1) excluding the recursion
	 * </p>
	 * 
	 * @param y The node to perform cascading cut on.
	 */
	protected void cascadingCut(Node y)
	{
		Node z = y.parent;

		// if there's a parent...
		if (z != null)
		{
			// if y is unmarked, set it marked
			if (!y.mark)
			{
				y.mark = true;
			}
			else
			{
				// it's marked, cut it from parent
				cut(y, z);

				// cut its parent as well
				cascadingCut(z);
			}
		}
	}

	/**
	 * Consolidates the trees in the heap by joining trees of equal degree until
	 * there are no more trees of equal degree in the root list.
	 * 
	 * <p>
	 * Running time: O(log n) amortized
	 * </p>
	 */
	protected void consolidate()
	{
		int arraySize = size + 1;
		Node[] array = new Node[arraySize];

		// Initialize degree array
		for (int i = 0; i < arraySize; i++)
		{
			array[i] = null;
		}

		// Find the number of root nodes.
		int numRoots = 0;
		Node x = min;

		if (x != null)
		{
			numRoots++;
			x = x.right;

			while (x != min)
			{
				numRoots++;
				x = x.right;
			}
		}

		// For each node in root list do...
		while (numRoots > 0)
		{
			// Access this node's degree..
			int d = x.degree;
			Node next = x.right;

			// ..and see if there's another of the same degree.
			while (array[d] != null)
			{
				// There is, make one of the nodes a child of the other.
				Node y = array[d];

				// Do this based on the key value.
				if (x.key > y.key)
				{
					Node temp = y;
					y = x;
					x = temp;
				}

				// Node y disappears from root list.
				link(y, x);

				// We've handled this degree, go to next one.
				array[d] = null;
				d++;
			}

			// Save this node for later when we might encounter another
			// of the same degree.
			array[d] = x;

			// Move forward through list.
			x = next;
			numRoots--;
		}

		// Set min to null (effectively losing the root list) and
		// reconstruct the root list from the array entries in array[].
		min = null;

		for (int i = 0; i < arraySize; i++)
		{
			if (array[i] != null)
			{
				// We've got a live one, add it to root list.
				if (min != null)
				{
					// First remove node from root list.
					array[i].left.right = array[i].right;
					array[i].right.left = array[i].left;

					// Now add to root list, again.
					array[i].left = min;
					array[i].right = min.right;
					min.right = array[i];
					array[i].right.left = array[i];

					// Check if this is a new min.
					if (array[i].key < min.key)
					{
						min = array[i];
					}
				}
				else
				{
					min = array[i];
				}
			}
		}
	}

	/**
	 * The reverse of the link operation: removes x from the child list of y.
	 * This method assumes that min is non-null.
	 * 
	 * <p>
	 * Running time: O(1)
	 * </p>
	 * 
	 * @param x The child of y to be removed from y's child list.
	 * @param y The parent of x about to lose a child.
	 */
	protected void cut(Node x, Node y)
	{
		// remove x from childlist of y and decrement degree[y]
		x.left.right = x.right;
		x.right.left = x.left;
		y.degree--;

		// reset y.child if necessary
		if (y.child == x)
		{
			y.child = x.right;
		}

		if (y.degree == 0)
		{
			y.child = null;
		}

		// add x to root list of heap
		x.left = min;
		x.right = min.right;
		min.right = x;
		x.right.left = x;

		// set parent[x] to nil
		x.parent = null;

		// set mark[x] to false
		x.mark = false;
	}

	/**
	 * Make node y a child of node x.
	 * 
	 * <p>
	 * Running time: O(1) actual
	 * </p>
	 * 
	 * @param y The node to become child.
	 * @param x The node to become parent.
	 */
	protected void link(Node y, Node x)
	{
		// remove y from root list of heap
		y.left.right = y.right;
		y.right.left = y.left;

		// make y a child of x
		y.parent = x;

		if (x.child == null)
		{
			x.child = y;
			y.right = y;
			y.left = y;
		}
		else
		{
			y.left = x.child;
			y.right = x.child.right;
			x.child.right = y;
			y.right.left = y;
		}

		// increase degree[x]
		x.degree++;

		// set mark[y] false
		y.mark = false;
	}

	/**
	 * Implements a node of the Fibonacci heap. It holds the information
	 * necessary for maintaining the structure of the heap. It also holds the
	 * reference to the key value (which is used to determine the heap
	 * structure). Additional Node data should be stored in a subclass.
	 */
	public static class Node
	{

		Object userObject;

		/**
		 * first child node
		 */
		Node child;

		/**
		 * left sibling node
		 */
		Node left;

		/**
		 * parent node
		 */
		Node parent;

		/**
		 * right sibling node
		 */
		Node right;

		/**
		 * true if this node has had a child removed since this node was added
		 * to its parent
		 */
		boolean mark;

		/**
		 * key value for this node
		 */
		double key;

		/**
		 * number of children of this node (does not count grandchildren)
		 */
		int degree;

		/**
		 * Default constructor. Initializes the right and left pointers, making
		 * this a circular doubly-linked list.
		 * 
		 * @param key The initial key for node.
		 */
		public Node(Object userObject, double key)
		{
			this.userObject = userObject;
			right = this;
			left = this;
			this.key = key;
		}

		/**
		 * Obtain the key for this node.
		 * 
		 * @return the key
		 */
		public final double getKey()
		{
			return key;
		}

		/**
		 * @return Returns the userObject.
		 */
		public Object getUserObject()
		{
			return userObject;
		}

		/**
		 * @param userObject The userObject to set.
		 */
		public void setUserObject(Object userObject)
		{
			this.userObject = userObject;
		}

	}

}
