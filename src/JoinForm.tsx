import { FormEvent } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';

interface IFormElements extends HTMLFormControlsCollection {
  username?: HTMLInputElement,
  room?: HTMLInputElement,
}

const JoinForm = () => {
  const navigate = useNavigate();

  const goToChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElements: IFormElements = (event.target as HTMLFormElement).elements;
    const { username, room } = formElements;
    const params = { username: username.value, room: room.value };
    navigate({
      pathname: 'chat',
      search: `?${createSearchParams(params)}`,
    });
  }

  return (
    <section className="home-page">
      <div className="join-form">
        <h1 className="title">Join</h1>
        <form onSubmit={goToChat} className="vertical">
          <label>
            <span className="label">Display name</span>
            <input name="username" autoComplete="off" required />
          </label>
          <label>
            <span className="label">Room</span>
            <input name="room" autoComplete="off" required />
          </label>
          <button className="join-button">Join</button>
        </form>
      </div>
    </section>
  )
}

export default JoinForm;
