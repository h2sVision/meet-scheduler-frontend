import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function DatePickerStatic({minDate, maxDate, openSlots, selectedDate, setSelectedDate}) {

    return (
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={(date)=>{openSlots(date);setSelectedDate(date)}}
          dateFormat="yyyy/MM/dd"
          minDate={new Date(minDate)}
          maxDate={new Date(maxDate)}
          inline // add the inline prop to display the date picker statically
        />
      </div>
    );
}