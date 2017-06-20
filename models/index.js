var Sequelize = require('sequelize');
var marked = require('marked');

var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        //since we are searching, editing, deleting by urlTitle, these need to be unique
        unique: true
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
        set: function (tags) {

            tags = tags || [];

            if (typeof tags === 'string') {
                tags = tags.split(',').map(function (str) {
                    return str.trim();
                });
            }

            this.setDataValue('tags', tags);

        }
    },
    // route: {
    //     type: Sequelize.VIRTUAL,
    //     get: function() {
    //         // var route = page.route
    //     }
    // }
}, {
    getterMethods: {
        route: function () {
            return '/wiki/' + this.urlTitle;
        },
        renderedContent: function () {
            return marked(this.content);
        }
    },
    classMethods: {
        findByTag: function (tag) {
            return this.findAll({
                where: {
                    tags: {
                        $contains: [tag]
                    }
                }
            });
        }
    },
    instanceMethods: {
        findSimilar: function () {
            return Page.findAll({
                where: {
                    id: {
                        $ne: this.id
                    },
                    tags: {
                        $overlap: this.tags
                    }
                }
            });
        },
        upperOrLowerCaseContent: function (bool) {
            if (bool) {
                return this.content.toUpperCase();
            } else {
                return this.content.toLowerCase();
            }
        }
    },
    hooks: {
        // this function will run as a result of sequelize validation
        // which can because we trigger it directly...`somePageInstance.validate()`
        // which can because we trigger it indirectly...`somePageInstance.save()`, `somePageInstance.create()`
        beforeValidate: function(page) { // <== hook functions receive the instance as the first argument
            if (page.title) {
                page.urlTitle = page.title.replace(/\s/g, '_').replace(/\W/g, '');
            } else {
                page.urlTitle = Math.random().toString(36).substring(2, 7);
            }
        }
    }
});

// Page.hook('beforeValidate', function (page) {
//     if (page.title) {
//         page.urlTitle = page.title.replace(/\s/g, '_').replace(/\W/g, '');
//     } else {
//         page.urlTitle = Math.random().toString(36).substring(2, 7);
//     }
// });

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    }
});

//This adds methods to 'Page', such as '.setAuthor'. It also creates a foreign key attribute on the Page table pointing at the User table
Page.belongsTo(User, {
    as: 'author'
});

module.exports = {
    Page: Page,
    User: User,
    db: db
};
