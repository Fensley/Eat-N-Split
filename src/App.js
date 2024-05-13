import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },

  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [friends, setFriends] = useState(initialFriends);

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriens] = useState(null);

  function handleAddFreind() {
    setShowAddFriend((show) => !show);
  }

  function handleFormFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleselect(friend) {
    setSelectedFriens((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriens(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onselected={handleselect}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleFormFriend} />}
        <Button onClick={handleAddFreind}>
          {" "}
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onselected, selectedFriend }) {
  return (
    <ul>
      {friends.map((each) => (
        <Friend
          friends={each}
          key={each.id}
          onselected={onselected}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friends, onselected, selectedFriend }) {
  const isSelected = selectedFriend?.id === friends.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friends.image} alt={friends.name} />
      <h3>
        {}
        {friends.name}
      </h3>
      {friends.balance < 0 && (
        <p className="red">
          you owe {friends.name} {Math.abs(friends.balance)}
        </p>
      )}

      {friends.balance > 0 && (
        <p className="green">
          you owe {friends.name} {Math.abs(friends.balance)}
        </p>
      )}

      {friends.balance === 0 && <p>you and {friends.name} are even</p>}

      <Button onClick={() => onselected(friends)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handlesubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label>👭Friendname</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [expense, setEpense] = useState("");
  const [whois, setWhois] = useState("user");
  const total = bill ? bill - expense : "";
  function handleForm(e) {
    setBill(Number(e.target.value));
  }
  function handleexpense(e) {
    setEpense(Number(e.target.value) > bill ? expense : Number(e.target.value));
  }

  function handlesplit(e) {
    e.preventDefault();
    if (!bill || !expense) return;
    onSplitBill(whois === "user" ? total : -expense);
    setBill("");
    setEpense("");
  }
  return (
    <form className="form-split-bill" onSubmit={handlesplit}>
      <h2> Split a bill with {selectedFriend.name} </h2>

      <label>💰 Bill value</label>
      <input type="text" value={bill} onChange={handleForm} />

      <label>🧍‍♂️ your expense</label>
      <input type="text" value={expense} onChange={handleexpense} />

      <label>👭 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={total} />

      <label>🤑 Who is paying the bill</label>
      <select value={whois} onChange={(e) => setWhois(e.target.value)}>
        <option value={"user"}>You</option>
        <option value={"friend"}>{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
