import React from 'react';
import { connect } from 'react-redux';
import { diaryGetMonth } from '../actions/DiaryActions';

import DateComponent from '../components/Date';

class DateContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getDate(this.props.year, this.props.month, this.props.day);
  }

  render() {
    if (this.props.isFetching) {
      return <div>loading...</div>;
    }
    return (
      <DateComponent
        thisUser={this.props.thisUser}
        otherUser={this.props.otherUser}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { diary, couple, users } = state;
  const { year, month, day } = diary.date;
  const thisUser = users[couple.thisUser];
  const otherUser = users[couple.otherUser];

  if (
    state.diary.dates[year] &&
    state.diary.dates[year][month][day].entries.length > 0
  ) {
    const entries = diary.dates[year][month][day].entries.map(
      entryId => diary.entries[entryId]
    );

    const thisUserEntry = entries.filter(
      entry => entry.user == couple.thisUser
    )[0] || { text: '' };
    const otherUserEntry = entries.filter(
      entry => entry.user == couple.otherUser
    )[0] || { text: 'No entry for this day ;(' };

    return {
      year,
      month,
      day,
      isFetching: false,
      thisUser: {
        name: thisUser.username,
        color: thisUser.color,
        text: thisUserEntry.text,
        updateText: thisUserEntry.text,
        isInEditMode: false
      },
      otherUser: {
        name: otherUser.username,
        color: otherUser.color,
        text: otherUserEntry.text
      }
    };
  }

  return {
    isFetching: true,
    thisUser: {
      name: thisUser.name,
      color: thisUser.color,
      text: ''
    },
    otherUser: {
      name: otherUser.name,
      color: otherUser.color,
      text: ''
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDate: (year, month, day) => dispatch(diaryGetMonth(year, month))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DateContainer);