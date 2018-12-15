'use strict';



var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

customElements.define('compodoc-menu', function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        _this.isNormalMode = _this.getAttribute('mode') === 'normal';
        return _this;
    }

    _createClass(_class, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            this.render(this.isNormalMode);
        }
    }, {
        key: 'render',
        value: function render(isNormalMode) {
            let tp = lithtml.html(
'<nav>\n    <ul class="list">\n        <li class="title">\n            \n                <a href="index.html" data-type="index-link">engage documentation</a>\n            \n        </li>\n\n        <li class="divider"></li>\n        ' + (isNormalMode ? '<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>' : '') + '\n        <li class="chapter">\n            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>\n            <ul class="links">\n                \n                    <li class="link">\n                        <a href="index.html" data-type="chapter-link">\n                            <span class="icon ion-ios-keypad" ></span>Overview\n                        </a>\n                    </li>\n                \n                \n                \n                    <li class="link">\n                        <a href="dependencies.html"\n                            data-type="chapter-link">\n                            <span class="icon ion-ios-list"></span>Dependencies\n                        </a>\n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n        <li class="chapter modules">\n            <a data-type="chapter-link" href="modules.html">\n                <div class="menu-toggler linked" data-toggle="collapse"\n                    ' + (isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"') + '>\n                    <span class="icon ion-ios-archive"></span>\n                    <span class="link-name">Modules</span>\n                    <span class="icon ion-ios-arrow-down"></span>\n                </div>\n            </a>\n            <ul class="links collapse"\n            ' + (isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"') + '>\n                \n                    <li class="link">\n                        <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>\n                        \n                            <li class="chapter inner">\n                                <div class="simple menu-toggler" data-toggle="collapse"\n                                    ' + (isNormalMode ? 'data-target="#components-links-module-AppModule-3f41286535879bf00015e95cec47348f"' : 'data-target="#xs-components-links-module-AppModule-3f41286535879bf00015e95cec47348f"') + '>\n                                    <span class="icon ion-md-cog"></span>\n                                    <span>Components</span>\n                                    <span class="icon ion-ios-arrow-down"></span>\n                                </div>\n                                <ul class="links collapse"\n                                    ' + (isNormalMode ? 'id="components-links-module-AppModule-3f41286535879bf00015e95cec47348f"' : 'id="xs-components-links-module-AppModule-3f41286535879bf00015e95cec47348f"') + '>\n                                    \n                                        <li class="link">\n                                            <a href="components/DeviceInfoPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeviceInfoPage</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/EventDatePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventDatePage</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/EventInfoPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventInfoPage</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/EventsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventsPage</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/HomePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/LoginModal.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginModal</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/LoginPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPage</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/MyApp.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyApp</a>\n                                        </li>\n                                    \n                                </ul>\n                            </li>\n                        \n                        \n                        \n                        \n                            <li class="chapter inner">\n                                <div class="simple menu-toggler" data-toggle="collapse"\n                                    ' + (isNormalMode ? 'data-target="#injectables-links-module-AppModule-3f41286535879bf00015e95cec47348f"' : 'data-target="#xs-injectables-links-module-AppModule-3f41286535879bf00015e95cec47348f"') + '>\n                                    <span class="icon ion-md-arrow-round-down"></span>\n                                    <span>Injectables</span>\n                                    <span class="icon ion-ios-arrow-down"></span>\n                                </div>\n                                <ul class="links collapse"\n                                    ' + (isNormalMode ? 'id="injectables-links-module-AppModule-3f41286535879bf00015e95cec47348f"' : 'id="xs-injectables-links-module-AppModule-3f41286535879bf00015e95cec47348f"') + '>\n                                    \n                                        <li class="link">\n                                            <a href="injectables/FirebaseAuthProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>FirebaseAuthProvider</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="injectables/FirebaseConfigProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>FirebaseConfigProvider</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="injectables/FirebaseDatabaseProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>FirebaseDatabaseProvider</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="injectables/GeofireProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>GeofireProvider</a>\n                                        </li>\n                                    \n                                </ul>\n                            </li>\n                        \n                        \n                    </li>\n                \n                    <li class="link">\n                        <a href="modules/ComponentsModule.html" data-type="entity-link">ComponentsModule</a>\n                        \n                            <li class="chapter inner">\n                                <div class="simple menu-toggler" data-toggle="collapse"\n                                    ' + (isNormalMode ? 'data-target="#components-links-module-ComponentsModule-d7061d88225cf741a5948b32e7fa46ee"' : 'data-target="#xs-components-links-module-ComponentsModule-d7061d88225cf741a5948b32e7fa46ee"') + '>\n                                    <span class="icon ion-md-cog"></span>\n                                    <span>Components</span>\n                                    <span class="icon ion-ios-arrow-down"></span>\n                                </div>\n                                <ul class="links collapse"\n                                    ' + (isNormalMode ? 'id="components-links-module-ComponentsModule-d7061d88225cf741a5948b32e7fa46ee"' : 'id="xs-components-links-module-ComponentsModule-d7061d88225cf741a5948b32e7fa46ee"') + '>\n                                    \n                                        <li class="link">\n                                            <a href="components/CalendarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">CalendarComponent</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/EventItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventItemComponent</a>\n                                        </li>\n                                    \n                                        <li class="link">\n                                            <a href="components/MapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapComponent</a>\n                                        </li>\n                                    \n                                </ul>\n                            </li>\n                        \n                        \n                        \n                        \n                        \n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n            \n        \n        \n        \n        \n        <li class="chapter">\n            <div class="simple menu-toggler" data-toggle="collapse"\n            ' + (isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"') + '>\n                <span class="icon ion-ios-paper"></span>\n                <span>Classes</span>\n                <span class="icon ion-ios-arrow-down"></span>\n            </div>\n            <ul class="links collapse"\n            ' + (isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"') + '>\n                \n                    <li class="link">\n                        <a href="classes/Device.html" data-type="entity-link">Device</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/Event.html" data-type="entity-link">Event</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/Organization.html" data-type="entity-link">Organization</a>\n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n            \n        \n        \n        \n        \n        \n        \n        <li class="chapter">\n            <div class="simple menu-toggler" data-toggle="collapse"\n            ' + (isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"') + '>\n                <span class="icon ion-ios-cube"></span>\n                <span>Miscellaneous</span>\n                <span class="icon ion-ios-arrow-down"></span>\n            </div>\n            <ul class="links collapse"\n            ' + (isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"') + '>\n                \n                \n                \n                    <li class="link">\n                      <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>\n                    </li>\n                \n                \n                    <li class="link">\n                      <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>\n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n            \n        \n        \n        <li class="chapter">\n            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>\n        </li>\n        \n        \n        \n        <li class="divider"></li>\n        <li class="copyright">\n                Documentation generated using <a href="https://compodoc.app/" target="_blank">\n                    \n                        \n                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">\n                        \n                    \n                </a>\n        </li>\n        \n    </ul>\n</nav>'
);
        this.innerHTML = tp.strings;
        }
    }]);

    return _class;
}(HTMLElement));