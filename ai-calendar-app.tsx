import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Brain, Plus, Users, MapPin, Zap, TrendingUp, Bell, Settings, Search, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

const AICalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Standup',
      date: new Date(2024, 8, 25),
      time: '09:00',
      duration: 30,
      type: 'meeting',
      priority: 'high',
      aiGenerated: false,
      attendees: 5,
      location: 'Conference Room A'
    },
    {
      id: 2,
      title: 'Focus Time: Project Development',
      date: new Date(2024, 8, 25),
      time: '10:00',
      duration: 120,
      type: 'focus',
      priority: 'high',
      aiGenerated: true,
      attendees: 1
    },
    {
      id: 3,
      title: 'Client Presentation Review',
      date: new Date(2024, 8, 26),
      time: '14:00',
      duration: 60,
      type: 'meeting',
      priority: 'medium',
      aiGenerated: false,
      attendees: 3,
      location: 'Online'
    },
    {
      id: 4,
      title: 'AI Suggested: Prep Time for Tomorrow',
      date: new Date(2024, 8, 26),
      time: '16:00',
      duration: 45,
      type: 'preparation',
      priority: 'medium',
      aiGenerated: true,
      attendees: 1
    }
  ]);
  
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiInsights, setShowAiInsights] = useState(false);

  // AI Insights and Suggestions
  const aiInsights = [
    {
      type: 'optimization',
      title: 'Schedule Optimization',
      message: 'You have 3 back-to-back meetings today. Consider adding 15-minute buffers.',
      action: 'Auto-add buffers'
    },
    {
      type: 'focus',
      title: 'Peak Productivity',
      message: 'Your most productive hours are 9-11 AM. Block this time for deep work.',
      action: 'Create focus block'
    },
    {
      type: 'travel',
      title: 'Travel Time Alert',
      message: 'Your 2 PM meeting location is 25 minutes away. Leave by 1:30 PM.',
      action: 'Add travel time'
    }
  ];

  const [weeklyStats, setWeeklyStats] = useState({
    meetingHours: 12,
    focusHours: 18,
    travelTime: 2.5,
    efficiency: 87
  });

  const processNaturalLanguage = (input) => {
    const suggestions = [];
    const lowerInput = input.toLowerCase();
    
    // Simple NLP simulation
    if (lowerInput.includes('meeting') || lowerInput.includes('call')) {
      const timeMatch = lowerInput.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      const dateMatch = lowerInput.match(/(tomorrow|today|monday|tuesday|wednesday|thursday|friday)/i);
      
      suggestions.push({
        title: input.charAt(0).toUpperCase() + input.slice(1),
        time: timeMatch ? timeMatch[0] : '10:00 AM',
        date: dateMatch ? dateMatch[0] : 'today',
        duration: lowerInput.includes('quick') ? 30 : 60,
        type: 'meeting',
        confidence: 0.9
      });
    }
    
    if (lowerInput.includes('focus') || lowerInput.includes('work on')) {
      suggestions.push({
        title: `Focus Time: ${input}`,
        time: '09:00 AM',
        date: 'today',
        duration: 120,
        type: 'focus',
        confidence: 0.85
      });
    }

    setAiSuggestions(suggestions);
  };

  const addEvent = (suggestion) => {
    const newEvent = {
      id: events.length + 1,
      title: suggestion.title,
      date: new Date(), // Simplified for demo
      time: suggestion.time,
      duration: suggestion.duration,
      type: suggestion.type,
      priority: 'medium',
      aiGenerated: false,
      attendees: suggestion.type === 'meeting' ? 3 : 1
    };
    
    setEvents([...events, newEvent]);
    setNaturalLanguageInput('');
    setAiSuggestions([]);
    setShowAddEvent(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return <Users className="w-3 h-3" />;
      case 'focus': return <Brain className="w-3 h-3" />;
      case 'preparation': return <Lightbulb className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type, aiGenerated = false) => {
    const colors = {
      meeting: aiGenerated ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-blue-500 text-white',
      focus: aiGenerated ? 'bg-green-100 text-green-800 border-green-200' : 'bg-green-500 text-white',
      preparation: aiGenerated ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-yellow-500 text-white',
      default: aiGenerated ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-gray-500 text-white'
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">AI Calendar</h1>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                Smart Scheduling
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAiInsights(!showAiInsights)}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>AI Insights</span>
              </button>
              
              <button
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Weekly Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Meeting Hours</span>
                  <span className="font-semibold text-blue-600">{weeklyStats.meetingHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Focus Hours</span>
                  <span className="font-semibold text-green-600">{weeklyStats.focusHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel Time</span>
                  <span className="font-semibold text-orange-600">{weeklyStats.travelTime}h</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency Score</span>
                    <span className="font-semibold text-purple-600">{weeklyStats.efficiency}%</span>
                  </div>
                </div>
              </div>
            </div>

            {showAiInsights && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AI Insights
                </h3>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                      <div className="font-medium text-gray-900 text-sm mb-1">
                        {insight.title}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {insight.message}
                      </div>
                      <button className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors">
                        {insight.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Calendar */}
          <div className="lg:col-span-3">
            {/* Calendar Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex space-x-2">
                  {['month', 'week', 'day'].map((viewType) => (
                    <button
                      key={viewType}
                      onClick={() => setView(viewType)}
                      className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                        view === viewType
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {viewType}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {getDaysInMonth(currentDate).map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const isToday = date && date.toDateString() === new Date().toDateString();
                  const isSelected = date && date.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <div
                      key={index}
                      onClick={() => date && setSelectedDate(date)}
                      className={`p-2 min-h-[100px] border rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
                        !date
                          ? 'bg-gray-50'
                          : isSelected
                          ? 'bg-blue-100 border-blue-300'
                          : isToday
                          ? 'bg-yellow-50 border-yellow-300'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {date && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-yellow-700' : isSelected ? 'text-blue-700' : 'text-gray-900'
                          }`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded text-center border ${getTypeColor(event.type, event.aiGenerated)} ${
                                  event.aiGenerated ? 'border-dashed' : ''
                                }`}
                              >
                                <div className="flex items-center justify-center space-x-1">
                                  {getTypeIcon(event.type)}
                                  <span className="truncate">{event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}</span>
                                </div>
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                {selectedDate.toDateString() === new Date().toDateString() ? "Today's Schedule" : `Schedule for ${selectedDate.toLocaleDateString()}`}
              </h3>
              
              <div className="space-y-3">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No events scheduled for this day</p>
                  </div>
                ) : (
                  getEventsForDate(selectedDate)
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          event.aiGenerated
                            ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-l-purple-400'
                            : 'bg-gray-50 border-l-blue-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {getTypeIcon(event.type)}
                              <h4 className="font-medium text-gray-900">{event.title}</h4>
                              {event.aiGenerated && (
                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                                  AI Suggested
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(event.time)} ({event.duration}min)
                              </span>
                              {event.attendees > 1 && (
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {event.attendees} attendees
                                </span>
                              )}
                              {event.location && (
                                <span className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            event.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : event.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {event.priority}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                AI-Powered Event Creation
              </h3>
              <button
                onClick={() => {
                  setShowAddEvent(false);
                  setNaturalLanguageInput('');
                  setAiSuggestions([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your event naturally:
              </label>
              <textarea
                value={naturalLanguageInput}
                onChange={(e) => {
                  setNaturalLanguageInput(e.target.value);
                  if (e.target.value.length > 10) {
                    processNaturalLanguage(e.target.value);
                  }
                }}
                placeholder="e.g., 'Meeting with John tomorrow at 2pm about project review' or 'Focus time for coding on Friday morning'"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="3"
              />
            </div>

            {aiSuggestions.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Suggestions:
                </label>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => addEvent(suggestion)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{suggestion.title}</div>
                          <div className="text-sm text-gray-600">
                            {suggestion.date} at {suggestion.time} ({suggestion.duration}min)
                          </div>
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {Math.round(suggestion.confidence * 100)}% match
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddEvent(false);
                  setNaturalLanguageInput('');
                  setAiSuggestions([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={aiSuggestions.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create with AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICalendar;