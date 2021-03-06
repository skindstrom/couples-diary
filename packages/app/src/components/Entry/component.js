import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import Header from '../Header';
import Loader from '../Loader';
import { months } from '../../constants';

import './styles.css';

const DEFAULT_ENTRY_HEIGHT = 400;
export class EntryForm extends Component {
  state = {
    text: this.props.entry,
    height: DEFAULT_ENTRY_HEIGHT,
  };

  notebook = null;

  componentDidMount() {
    const textarea = this.getTextarea();
    if (textarea !== null) {
      textarea.focus();
      const length = this.state.text.length;
      textarea.setSelectionRange(length, length);
    }
  }

  getTextarea() {
    if (this.notebook == null) {
      return null;
    }

    return this.notebook.querySelector('.content');
  }

  updateHeight = () => {
    if (this.notebook !== null) {
      const textarea = this.getTextarea();

      if (textarea.scrollHeight !== this.state.height) {
        this.setState({ height: textarea.scrollHeight });
      }
    }
  };

  onChangeText = ({ currentTarget: { value } }) => {
    this.setState({ text: value });
    this.props.locallySaveEntry(value);
  };

  onSubmit = e => {
    if (e !== undefined) {
      e.preventDefault();
    }
    this.props.saveEntry(this.state.text);
  };

  onReset = e => {
    e.preventDefault();
    this.setState({ text: this.props.entry });
  };

  render() {
    const { nameOfUser, loading } = this.props;

    return (
      <form
        onSubmit={this.onSubmit}
        onReset={this.onReset}
        className="entry-body"
      >
        <h3>{nameOfUser}</h3>
        {loading && <Loader size="small" className="entry-loader" />}
        <div
          className="notebook"
          style={{ height: `${this.state.height}px` }}
          ref={notebook => {
            this.notebook = notebook;
            this.updateHeight();
          }}
        >
          <div
            aria-hidden
            className="back"
            style={{ height: `${this.state.height}px` }}
          />
          <textarea
            className="content"
            title="Diary entry"
            value={this.state.text}
            onChange={this.onChangeText}
            style={{ height: `${this.state.height}px` }}
            onKeyDown={({ key, ctrlKey }) =>
              key === 'Enter' && ctrlKey && this.onSubmit()
            }
          />
        </div>
        <div className="buttons">
          {this.props.getLocallySavedEntry() &&
            this.props.getLocallySavedEntry() !== this.state.text && (
              <input
                type="button"
                value="Reset local copy of entry"
                onClick={() =>
                  this.setState({ text: this.props.getLocallySavedEntry() })
                }
              />
            )}
          {this.props.entry === this.state.text ? (
            <p>Saved</p>
          ) : (
            <Fragment>
              <strong className="error">
                {this.props.errorOnSave && 'Could not save entry, try again'}
              </strong>
              <input type="reset" value="Discard changes" />
              <input type="submit" value="Save" />
            </Fragment>
          )}
        </div>
      </form>
    );
  }
}

EntryForm.propTypes = {
  nameOfUser: PropTypes.string.isRequired,
  saveEntry: PropTypes.func.isRequired,
  entry: PropTypes.string.isRequired,
  errorOnSave: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  locallySavedEntry: PropTypes.string.isRequired,
  locallySaveEntry: PropTypes.func.isRequired,
};

export class EntryBody extends Component {
  state = {
    height: DEFAULT_ENTRY_HEIGHT,
  };

  notebook = null;

  updateHeight = () => {
    if (this.notebook !== null) {
      const content = this.notebook.querySelector('.content');

      const heightOfContentExcludingPadding = content.scrollHeight;

      if (heightOfContentExcludingPadding !== this.state.height) {
        const heightOfContentWithPadding = heightOfContentExcludingPadding + 15;
        this.setState({ height: heightOfContentWithPadding });
      }
    }
  };

  render() {
    const { nameOfUser, loading } = this.props;

    return (
      <div className="entry-body">
        <h3>{nameOfUser}</h3>
        {loading && <Loader size="small" className="entry-loader" />}
        <div
          className="notebook"
          style={{ height: `${this.state.height}px` }}
          ref={notebook => {
            this.notebook = notebook;
            this.updateHeight();
          }}
        >
          <div
            aria-hidden
            className="back"
            style={{ height: `${this.state.height}px` }}
          />
          <p className="content" style={{ height: `${this.state.height}px` }}>
            {this.props.entry}
          </p>
        </div>
      </div>
    );
  }
}

EntryBody.propTypes = {
  nameOfUser: PropTypes.string.isRequired,
  entry: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

const Entry = ({ year, month, date, body, nameOfPartner }) => (
  <Fragment>
    <Header />
    <section className="entry">
      <nav>
        <Link to={`/calendar/${year}/${month}`} title="Back to calendar">
          <svg
            aria-hidden
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="25"
            height="25"
          >
            <path
              fill="currentColor"
              d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"
            />
          </svg>
        </Link>
        <header>
          <h2>{year}</h2>
          <h1>{`${months[month - 1]} ${date}`}</h1>
        </header>
        <Link
          to={`/entry/${year}/${month}/${date}/${nameOfPartner}`}
          title="Read partner's entry"
        >
          Read other
        </Link>
      </nav>
      <main>{body}</main>
    </section>
  </Fragment>
);

Entry.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  body: PropTypes.node.isRequired,
  nameOfPartner: PropTypes.string.isRequired,
};

export default Entry;
