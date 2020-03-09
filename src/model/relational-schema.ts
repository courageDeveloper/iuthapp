/**
 * Schema defining the db relations
 */
export const Schema = [
    {
        singular: 'staff',
        plural: 'staffs',
        relations: {
            department: {
                belongsTo: 'department'
            },
            expenses: {
                hasMany: {
                    type: 'expense',
                }
            }
        }
    },
    {
        singular: 'department',
        plural: 'departments',
        relations: {
            staffs: {
                hasMany: {
                    type: 'staff',
                    options: {
                        queryInverse: 'department'
                    }
                }
            },
        }
    },
    {
        singular: 'evacuate',
        plural: 'evacuates',
    },
    {
        singular: 'stock',
        plural: 'stocks',
    },
    {
        singular: 'departmentdispatch',
        plural: 'departmentdispatchs',
    },
    {
        singular: 'damagedproduct',
        plural: 'damagedproducts',
    },
    {
        singular: 'individualsale',
        plural: 'individualsales',
    },
    {
        singular: 'grossprofit',
        plural: 'grossprofits',
    },
    {
        singular: 'netprofit',
        plural: 'netprofits',
    },
    {
        singular: 'sale',
        plural: 'sales',
        relations: {
            patient: {
                belongsTo: 'patient'
            },
            counterproduct: {
                belongsTo: 'counterproduct'
            },
            products: {
                hasMany: {
                    type: 'product',
                    options: {
                        async: true
                    }
                },
            },
            services: {
                hasMany: {
                    type: 'service',
                    options: {
                        async: true
                    }
                },
            },
            renderservice: {
                belongsTo: 'renderservice'
            }
        }
    },
    {
        singular: 'expense',
        plural: 'expenses',
        relations: {
            staff: {
                belongsTo: 'staff'
            },
            vendor: {
                belongsTo: 'vendor'
            },
        }
    },
    {
        singular: 'product',
        plural: 'products',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'bec_pharmproduct',
        plural: 'bec_pharmproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'gopdproduct',
        plural: 'gopdproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'labproduct',
        plural: 'labproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'counterproduct',
        plural: 'counterproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'radiologyproduct',
        plural: 'radiologyproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'theaterproduct',
        plural: 'theaterproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'productcategory',
        plural: 'productcategorys',
        relations: {
            products: {
                hasMany: {
                    type: 'product',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'service',
        plural: 'services',
        relations: {
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'renderservice',
        plural: 'renderservices',
        relations: {
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'patient',
        plural: 'patients',
        relations: {
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'vendor',
        plural: 'vendors',
        relations: {
            expenses: {
                hasMany: {
                    type: 'expense',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'dispatchedproduct',
        plural: 'dispatchedproducts',
        relations: {
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    }
]