import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';

function DropdownFilter({
  align
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="btn bg-white dark:bg-slate-800 border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Filter</span>
        <wbr />
        <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
          <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full left-0 right-auto min-w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pt-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === 'right' ? 'md:left-auto md:right-0' : 'md:left-0 md:right-auto'
        }`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">Filters</div>
          <div className="flex">
            <ul className="flex-1 mb-4">
              {/* Types de contrats */}
              <li className="py-1 px-3">
                <label className="flex items-center">
                  <span className="text-sm font-medium ml-2">Types de contrats</span>
                </label>
                <ul className="ml-6">
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Temps plein</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Temps partiel</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Freelance</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Stage</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Apprentissage</span>
                    </label>
                  </li>
                </ul>
              </li>
              {/* Rythmes de travail */}
              <li className="py-1 px-3">
                <label className="flex items-center">
                  <span className="text-sm font-medium ml-2">Rythmes de travail</span>
                </label>
                <ul className="ml-6">
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Journée</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Nuit</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Rotation</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Télétravail</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Horaires flexibles</span>
                    </label>
                  </li>
                </ul>
              </li>
            </ul>
            <ul className="flex-1 mb-4 ml-4">
              {/* Date de publication */}
              <li className="py-1 px-3">
                <label className="flex items-center">
                  <span className="text-sm font-medium ml-2">Date de publication</span>
                </label>
                <ul className="ml-6">
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Moins d'une semaine</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Moins d'un mois</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Moins de trois mois</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Plus de trois mois</span>
                    </label>
                  </li>
                </ul>
              </li>
              {/* Expériences exigées */}
              <li className="py-1 px-3">
                <label className="flex items-center">
                  <span className="text-sm font-medium ml-2">Expériences exigées</span>
                </label>
                <ul className="ml-6">
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Débutant</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Junior</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Confirmé</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Expert</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-xs font-medium ml-2">Senior</span>
                    </label>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="py-2 px-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/20">
            <ul className="flex items-center justify-between">
              <li>
                <button className="btn-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-200">
                  Clear
                </button>
              </li>
              <li>
                <button
                  className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => setDropdownOpen(false)}
                  onBlur={() => setDropdownOpen(false)}
                >
                  Apply
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownFilter;


