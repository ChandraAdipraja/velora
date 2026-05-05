import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const DateTimePicker = ({
  value = "",
  onChange,
  minDateTime = "",
  maxDateTime = "",
  placeholder = "Select date and time",
  label = "",
  type = "checkout", // 'checkin' or 'checkout'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null,
  );
  const [selectedTime, setSelectedTime] = useState(
    value ? value.split("T")[1]?.slice(0, 5) || "00:00" : "00:00",
  );
  const containerRef = useRef(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateDisplay = (date, time) => {
    if (!date) return "";
    const dateStr = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${dateStr} • ${time}`;
  };

  const getMinSelectableHour = () => {
    if (!minDateTime || !selectedDate) return 0;

    const minDate = new Date(minDateTime);
    const minDateOnly = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate(),
    );
    const selectedDateOnly = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );

    // Jika tanggal sama
    if (minDateOnly.getTime() === selectedDateOnly.getTime()) {
      const minHour = parseInt(minDateTime.split("T")[1].split(":")[0]);

      // Untuk checkin: gunakan jam minimum langsung
      if (type === "checkin") {
        return minHour;
      }

      // Untuk checkout: tambah 3 jam dari jam minimum checkin
      return minHour + 3;
    }

    return 0;
  };

  const isDateSelectable = (date) => {
    const dateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const minDate = minDateTime ? new Date(minDateTime) : null;
    const maxDate = maxDateTime ? new Date(maxDateTime) : null;

    if (minDate) {
      const minDateOnly = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate(),
      );

      // Hanya check tanggal, bukan jam
      // Jam validation dilakukan di getMinSelectableHour dan handleTimeChange
      if (dateTime < minDateOnly) return false;
    }

    if (maxDate) {
      const maxDateOnly = new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        maxDate.getDate(),
      );
      if (dateTime > maxDateOnly) return false;
    }

    return true;
  };

  const handleDateSelect = (day) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    if (!isDateSelectable(selected)) return;

    setSelectedDate(selected);

    // Jika tanggal sama dengan min date, gunakan jam minimum yang valid
    let timeToUse = selectedTime.split(":")[0] + ":00"; // Ensure menit selalu :00
    if (minDateTime) {
      const minDate = new Date(minDateTime);
      const minDateOnly = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate(),
      );
      const selectedDateOnly = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
      );

      if (minDateOnly.getTime() === selectedDateOnly.getTime()) {
        const minHour = parseInt(minDateTime.split("T")[1].split(":")[0]);

        // Untuk checkin: gunakan jam minimum langsung
        if (type === "checkin") {
          timeToUse = `${String(minHour).padStart(2, "0")}:00`;
        } else {
          // Untuk checkout: tambah 3 jam
          const checkoutHour = minHour + 3;
          timeToUse = `${String(checkoutHour).padStart(2, "0")}:00`;
        }
        setSelectedTime(timeToUse);
      }
    }

    const dateTimeString = `${selected.getFullYear()}-${String(
      selected.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}T${timeToUse}`;

    onChange(dateTimeString);
  };

  const handleTimeChange = (time) => {
    // Ensure menit selalu :00
    const hourOnly = time.split(":")[0];
    const timeWithoutMinutes = `${hourOnly}:00`;

    if (selectedDate) {
      // Validate jam terhadap minDateTime jika tanggal sama
      if (minDateTime) {
        const minDate = new Date(minDateTime);
        const minDateOnly = new Date(
          minDate.getFullYear(),
          minDate.getMonth(),
          minDate.getDate(),
        );
        const selectedDateOnly = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );

        // Jika tanggal sama dengan min date, validate jam
        if (minDateOnly.getTime() === selectedDateOnly.getTime()) {
          const minHour = parseInt(minDateTime.split("T")[1].split(":")[0]);
          const selectedHour = parseInt(hourOnly);

          if (type === "checkin") {
            // Untuk checkin: jam harus >= minHour
            if (selectedHour < minHour) {
              return; // Don't update if time is invalid
            }
          } else {
            // Untuk checkout: jam harus >= minHour + 3
            if (selectedHour < minHour + 3) {
              return; // Don't update if time is invalid
            }
          }
        }
      }
    }

    setSelectedTime(timeWithoutMinutes);

    if (selectedDate) {
      const dateTimeString = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1,
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
        2,
        "0",
      )}T${timeWithoutMinutes}`;

      onChange(dateTimeString);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const monthName = currentDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative z-20" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-(--muted) mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-2xl border border-(--border-soft) bg-white/80 px-4 py-3 text-sm text-left outline-none focus:border-(--champagne) hover:bg-white transition"
      >
        <div className="flex items-center justify-between">
          <span
            className={
              selectedDate ? "text-(--navy) font-medium" : "text-(--muted)"
            }
          >
            {selectedDate
              ? formatDateDisplay(selectedDate, selectedTime)
              : placeholder}
          </span>
          <Clock className="h-4 w-4 text-(--champagne) shrink-0" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-[9999] mt-2 w-full rounded-2xl border border-(--border-soft) bg-white shadow-xl p-4 sm:w-96">
          <div className="space-y-4">
            {/* Calendar Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft className="h-4 w-4 text-(--navy)" />
                </button>
                <h3 className="text-sm font-semibold text-(--navy) capitalize">
                  {monthName}
                </h3>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight className="h-4 w-4 text-(--navy)" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                  <div
                    key={dayName}
                    className="h-8 flex items-center justify-center text-xs font-semibold text-(--muted)"
                  >
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const isSelectable =
                    day &&
                    isDateSelectable(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day,
                      ),
                    );

                  const isSelected =
                    day &&
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentDate.getMonth() &&
                    selectedDate.getFullYear() === currentDate.getFullYear();

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => day && handleDateSelect(day)}
                      disabled={!isSelectable}
                      className={`h-8 rounded-lg text-xs font-medium transition ${
                        !day
                          ? ""
                          : isSelected
                            ? "bg-(--champagne) text-white"
                            : isSelectable
                              ? "text-(--navy) hover:bg-gray-100"
                              : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Section */}
            <div className="border-t border-(--border-soft) pt-4">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted) block mb-2">
                Time
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedTime.split(":")[0]}
                  onChange={(e) => {
                    const hour = e.target.value;
                    handleTimeChange(`${hour}:00`);
                  }}
                  className="flex-1 px-3 py-2 border border-(--border-soft) rounded-lg text-sm outline-none focus:border-(--champagne)"
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const minHour = getMinSelectableHour();
                    if (i < minHour) return null;

                    const hour = String(i).padStart(2, "0");
                    return (
                      <option key={hour} value={hour}>
                        {hour}:00
                      </option>
                    );
                  }).filter(Boolean)}
                </select>
              </div>
            </div>

            {/* Selected info */}
            {selectedDate && (
              <div className="border-t border-(--border-soft) pt-4 bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-(--muted) mb-1">Selected:</p>
                <p className="text-sm font-semibold text-(--navy)">
                  {selectedDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at {selectedTime}
                </p>
              </div>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full rounded-lg bg-(--champagne) text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
