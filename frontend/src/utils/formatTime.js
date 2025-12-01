export const formatTime=(date)=> {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 365 * 24 * 60 * 60,
      month: 30 * 24 * 60 * 60,
      week: 7 * 24 * 60 * 60,
      day: 24 * 60 * 60,
      hour: 60 * 60,
      minute: 60,
      second: 1
    };

    for (let key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value > 0) {
        return `${value} ${key}${value > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }