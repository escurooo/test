import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../orders.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    items TEXT NOT NULL,
    customer_name TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  )
`);

export interface Order {
  id: string;
  items: OrderItem[];
  customer_name?: string;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  created_at: number;
  updated_at: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  special_instructions?: string;
}

export const orderDb = {
  createOrder: (order: Omit<Order, 'created_at' | 'updated_at'>) => {
    const stmt = db.prepare(`
      INSERT INTO orders (id, items, customer_name, notes, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      order.id,
      JSON.stringify(order.items),
      order.customer_name || null,
      order.notes || null,
      order.status
    );

    return orderDb.getOrder(order.id);
  },

  getOrder: (id: string): Order | null => {
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      items: JSON.parse(row.items),
      customer_name: row.customer_name,
      notes: row.notes,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  },

  getAllOrders: (): Order[] => {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const rows = stmt.all() as any[];

    return rows.map(row => ({
      id: row.id,
      items: JSON.parse(row.items),
      customer_name: row.customer_name,
      notes: row.notes,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  },

  getActiveOrders: (): Order[] => {
    const stmt = db.prepare(`
      SELECT * FROM orders
      WHERE status IN ('pending', 'preparing', 'ready')
      ORDER BY created_at ASC
    `);
    const rows = stmt.all() as any[];

    return rows.map(row => ({
      id: row.id,
      items: JSON.parse(row.items),
      customer_name: row.customer_name,
      notes: row.notes,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  },

  updateOrderStatus: (id: string, status: Order['status']): Order | null => {
    const stmt = db.prepare(`
      UPDATE orders
      SET status = ?, updated_at = strftime('%s', 'now')
      WHERE id = ?
    `);

    stmt.run(status, id);
    return orderDb.getOrder(id);
  },

  deleteOrder: (id: string): void => {
    const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
    stmt.run(id);
  }
};

export default db;
