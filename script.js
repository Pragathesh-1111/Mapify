'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const $ = selector => document.querySelector(selector);
const $All = selector => document.querySelectorAll(selector);
const dom = {
  form: $('.form'),
  containerWorkouts: $('.workouts'),
  inputType: $('.form__input--type'),
  inputDistance: $('.form__input--distance'),
  inputDuration: $('.form__input--duration'),
  inputCadence: $('.form__input--cadence'),
  inputElevation: $('.form__input--elevation'),
  inputSteps: $('.form__input--Steps'),
};
const inputCategaries = {
  cycling: dom.inputElevation,
  running: dom.inputCadence,
  walking: dom.inputSteps,
};

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // Km
    this.duration = duration; // Min
  }
}

class Cycling extends Workout {
  type = 'cycling';
  emoji = '🚴';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calSpeed();
  }

  calSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
class Running extends Workout {
  type = 'running';
  emoji = '🏃';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calPace();
  }

  calPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

const a = new Cycling([1, 1], 1, 1, 1);
console.log(a.emoji);

class Walking extends Workout {
  type = 'walking';
  emoji = '🚶';

  constructor(coords, distance, duration, steps) {
    super(coords, distance, duration);
    this.steps = steps;
    this.calPace();
  }
  calPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

let map, mapEvent;
class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    // Autocalling the user position
    this._getPosition();

    // Event handlers
    dom.inputType.addEventListener(
      'change',
      this._toggleElevationField.bind(this),
    );
    dom.form.addEventListener('submit', this._newWorkout.bind(this));
    dom.containerWorkouts.addEventListener(
      'click',
      this._moveToPopup.bind(this),
    );

    // Add all stored Locations after page loads
    this._getLocalStorage();
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Cannot access your location');
        },
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    // Handling Clicks in the map
    this.#map = L.map('map').setView(coords, 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          maxWidth: 250,
          maxHeight: 100,
          closeOnClick: false,
          closeButton: false,
        }).setContent('You are here!!'),
      )
      .openPopup();

    // Click event on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      // Add Markers in Map
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    dom.form.classList.remove('hidden');
    dom.inputDistance.focus();
    this.#mapEvent = mapE;
  }

  _hideForm() {
    dom.form.style.display = 'none';
    dom.form.classList.add('hidden');
    setTimeout(() => {
      dom.form.style.display = 'grid';
    }, 500);
  }

  _toggleElevationField(e) {
    const inputArray = [...Object.values(inputCategaries)];

    inputArray.forEach(inp => {
      inp.closest('.form__row').classList.add('form__row--hidden');
    });

    inputCategaries[e.currentTarget.value]
      .closest('.form__row')
      .classList.remove('form__row--hidden');
  }

  _newWorkout(e) {
    const isValid = function (...inputs) {
      return inputs.every(
        inp => Number.isFinite(Number(inp)) && Number(inp) > 0,
      );
    };
    e.preventDefault();

    //----- Data ------//
    const [type, distance, duration] = [
      dom.inputType.value,
      dom.inputDistance.value,
      dom.inputDuration.value,
    ];
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // Gaurding
    if (!isValid(distance, duration))
      return alert('Inputs should be Positive Numbers');

    if (type === 'cycling') {
      const elevation = Number(dom.inputElevation.value);

      // Gaurding
      if (!isValid(elevation))
        return alert('Inputs should be Positive Numbers');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    if (type === 'running') {
      const cadence = Number(dom.inputCadence.value);

      // Gaurding
      if (!isValid(cadence)) return alert('Inputs should be Positive Numbers');
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    if (type === 'walking') {
      const steps = Number(dom.inputSteps.value);

      // Gaurding
      if (!isValid(steps)) return alert('Inputs should be Positive Numbers');
      workout = new Walking([lat, lng], distance, duration, steps);
    }

    this.#workouts.push(workout);

    // Add to local storage
    this._setLocalStorage();

    // Clearing inputs
    dom.inputDuration.value =
      dom.inputDistance.value =
      dom.inputCadence.value =
      dom.inputElevation.value =
      dom.inputSteps.value =
        '';

    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          maxWidth: 250,
          maxHeight: 100,
          closeOnClick: false,
          closeButton: false,
          className: `${workout.type}-popup`, // Controlling the type of workout
        }).setContent(
          `${workout.emoji} ${workout.type.slice(0, 1).toUpperCase() + workout.type.slice(1)} on ${months[workout.date.getMonth()]} ${workout.date.getDate()}`,
        ),
      )
      .openPopup();
  }

  _emojiFunction(workout) {
    if (workout.type === 'cycling') return '🚴';
    if (workout.type === 'running') return '🏃';
    if (workout.type === 'walking') return '🚶';
  }

  _calElevationCadenceSteps(workout) {
    if (workout.type === 'cycling') return workout.elevationGain;
    if (workout.type === 'running') return workout.cadence;
    if (workout.type === 'walking') return workout.steps;
  }

  _renderWorkout(workout) {
    const html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.type.slice(0, 1).toUpperCase() + workout.type.slice(1)} on ${months[workout.date.getMonth()]} ${workout.date.getDate()}</h2>
      <div class="workout__details">
        <span class="workout__icon">${workout.emoji}</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.type === 'cycling' ? workout.speed.toFixed(1) : workout.pace.toFixed(1)}</span>
        <span class="workout__unit">${workout.type === 'cycling' ? 'km/h' : 'min/km'}</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${this._calElevationCadenceSteps(workout)}</span>
        <span class="workout__unit">${workout.type === 'cycling' ? 'm' : 'spm'}</span>
      </div>
    </li>
      `;

    dom.form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const selectedId = this.#workouts.find(
      workout => workout.id === workoutEl.dataset.id,
    );
    this.#map.setView(selectedId.coords, 15);
  }

  _setLocalStorage() {
    localStorage.setItem('Workouts', JSON.stringify(this.#workouts));
  }

  //----- Local Storage data to inheretence data -----//
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('Workouts'));

    // Gaurding
    if (!data) return;
    //---//

    this.#workouts = data;

    this.#workouts = data.map(work => {
      let workout;

      if (work.type === 'cycling') {
        workout = new Cycling(
          work.coords,
          work.distance,
          work.duration,
          work.elevationGain,
        );
      }

      if (work.type === 'running') {
        workout = new Running(
          work.coords,
          work.distance,
          work.duration,
          work.cadence,
        );
      }

      if (work.type === 'walking') {
        workout = new Walking(
          work.coords,
          work.distance,
          work.duration,
          work.steps,
        );
      }

      workout.date = new Date(work.date);
      workout.id = work.id;

      return workout;
    });

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('Workouts');
    location.reload();
  }
}

const app = new App();
