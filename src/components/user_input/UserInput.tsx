import React, { ChangeEventHandler, useCallback, useState } from "react";
import mappings from "../../data/mappings.json";
import {
    Button,
    Collapse,
    Grid,
    makeStyles,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    withStyles,
    Switch
} from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import english from '../../data/en.json'
import korean from '../../data/ko.json'
import styled from '@emotion/styled'
import { CSVLink} from 'react-csv'

const Input = styled.input`
    margin-bottom: 5px;
    width: 200px;
`

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none'
    },
    root: {
        width: "100%",
        minWidth: 360,
        backgroundColor: "rgba(0,0,0,0)",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
    },
    nested: {
        paddingLeft: theme.spacing(4),
        height: "30px"
    },
    checkboxContainer: {
        display: "flex",
        flexDirection: "row",
    },
    dataAlign: {
        display: "flex",
        flexDirection: "row",
        height: "600px",
    }, 
    dataOutput: {
        display: "flex",
        flexDirection: "column",
        height: "600px",
        overflow: "auto",
    },
    outputFormat: {
        display: "flex",
        flexDirection: "row",
        marginBottom: "5%",
        height: "50px"
    },
    keyword: {
        marginRight: "10%",
        minWidth: "200px"
    },
    subList: {
        maxHeight: "120px",
        overflow: "auto"
    },
    outputContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    breakline: {
        display: "flex",
        justifyContent: "center",
        borderBottom: "solid 1px black",
        width: "600px",
        marginBottom: "20px",
        textDecoration: "none"
    },
}));

const AntSwitch = withStyles(theme => ({
    root: {
      width: 28,
      height: 14,
      padding: 2,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);

export const UserInput: React.FC = () => {
    const [catSearch, updateCatSearch] = useState("");

    const classes = useStyles();
    const [urlInput, setUrlInput] = useState('');
    const [designerInput, setDesignerInput] = useState('')
    const [checked, setChecked] = useState<Array<number>>([]);
    const [catExpanded, setCatExpanded] = useState<Array<number>>([]);
    const [subChecked, setSubChecked] = useState({});
    const [genderChecked, setGenderChecked] = useState<Array<number>>([]);
    const [switchState, setSwitchState] = useState(false);

    const handleSwitchChange = (event: any) => {
        setSwitchState(event.target.checked);
      };

    const onCatSearchChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        event => {
            updateCatSearch(event.currentTarget.value);
        },
        []
    );
    
    const onUrlInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>( event => {
        const value = event.currentTarget.value
        setUrlInput(value)
    }, []);

    const onDesignerInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>( event => {
        const value = event.currentTarget.value
        setDesignerInput(value)
    }, []);

    const renderGenderItem = useCallback((gender: string) => {
        const value = Object.keys(english.gender).indexOf(gender)

        const isChecked = genderChecked.includes(value)

        const genderHandleToggle = () => {
            const currentIndex = genderChecked.indexOf(value);
            const newChecked = [...genderChecked];

            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setGenderChecked(newChecked);
        };

        return (
            <div key={gender}>
                <ListItem
                    key={value}
                    role={undefined}
                    dense
                    button
                    onClick={genderHandleToggle}
                >
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={isChecked}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": gender }}
                        />
                    </ListItemIcon>

                    <ListItemText id={gender} primary={switchState ? korean.gender[gender][0] : english.gender[gender][0]} />
                </ListItem>

            </div>
        );
    },
    [genderChecked, setGenderChecked, switchState]
);

    const renderSubcats = useCallback(
        (cat: string, subcat: string) => {
            const value = mappings[cat].indexOf(subcat);

            const isChecked = subChecked[cat] ? subChecked[cat].includes(value) : false;

            const subHandleToggle = () => {
                const newSubChecked = subChecked[cat] ? [...subChecked[cat]] : [];
                if (isChecked) {
                    newSubChecked.splice(newSubChecked.indexOf(value), 1);
                } else {
                    newSubChecked.push(value);
                }

                setSubChecked(prevSubChecked => ({
                    ...prevSubChecked,
                    [cat]: newSubChecked
                }));
            };

            return (
                <ListItem
                    key={cat + subcat}
                    dense
                    button
                    onClick={subHandleToggle}
                    className={classes.nested}
                >
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={isChecked}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": subcat }}
                        />
                    </ListItemIcon>
                    <ListItemText primary={switchState ? korean.subcategories[subcat].join(' / ') : english.subcategories[subcat][0]} />
                </ListItem>
            );
        },
        [subChecked, classes.nested, switchState]
    );

    const renderCatItem = useCallback(
        (cat: string) => {
            const value = Object.keys(mappings).indexOf(cat);

            const isChecked = checked.includes(value);
            const isExpanded = catExpanded.includes(value);

            const handleToggle = () => {
                const currentIndex = checked.indexOf(value);
                const newChecked = [...checked];
                const newSubChecked = subChecked
                const newExpanded = [...catExpanded]
                const expandedIndex = catExpanded.indexOf(value)

                if (currentIndex === -1) {
                    newChecked.push(value);
                } else {
                    newChecked.splice(currentIndex, 1);
                    delete newSubChecked[cat]
                    newExpanded.splice(expandedIndex, 1);
                    setSubChecked(newSubChecked)
                }
                setCatExpanded(newExpanded)
                setChecked(newChecked);
            };

            const handleClick = () => {
                const currentIndex = catExpanded.indexOf(value);
                const newExpanded = [...catExpanded];

                if (currentIndex === -1) {
                    newExpanded.push(value);
                } else {
                    newExpanded.splice(currentIndex, 1);
                }
                setCatExpanded(newExpanded);
            };

            return (
                <div key={cat}>
                    <ListItem
                        key={value}
                        role={undefined}
                        dense
                        button
                        onClick={handleToggle}
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={isChecked}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ "aria-labelledby": cat }}
                            />
                        </ListItemIcon>

                        <ListItemText id={cat} primary={switchState ? korean.categories[cat][0] : english.categories[cat][0]} />
                        { mappings[cat].length > 0 && isChecked ?
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="Comments"
                                onClick={handleClick}
                            >
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItemSecondaryAction> : ''}
                    </ListItem>
                    { mappings[cat].length > 0 && isChecked ? <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List className={classes.subList} component="div" disablePadding>
                            {mappings[cat].map((subcat: string) =>
                                renderSubcats(cat, subcat)
                            )}
                        </List>
                    </Collapse> : ''}
                </div>
            );
        },
        [checked, catExpanded, setCatExpanded, renderSubcats, setSubChecked, subChecked, switchState, classes.subList]
    );

    const url: any = []

    const csv = [['keyword', 'url']]

    const renderData = useCallback(() => {
        const cats = checked.map(idx => {
            return Object.keys(mappings)[idx]
        })

        const gender = genderChecked.map(idx => {
            return Object.keys(english.gender)[idx]
        })


        // cats [ 'bags', 'rtw' ]

       const getKoreanCats = (cat: string): string[] => {
        return korean.categories[cat]
       }

       const getKoreanSubs = (sub: string): string[] => {
        return korean.subcategories[sub]
       }

       const getKoreanGenders = (gender: string): string[] => {
        return korean.gender[gender]
       }
        

       let subcats;

    if(switchState === false) {
        // english
       subcats = cats.map( cat => {
        const results: Array<Array<string>> = []
        url.push([cat]) // url [ ['bags'] ]
        results.push([cat]) // results [ ['bags'] ]
        if(subChecked.hasOwnProperty(cat)) {
            subChecked[cat].map( (subIdx: number) => {
                const sub = mappings[cat][subIdx]
                if(genderChecked.length > 0) {
                    gender.map( gender => {
                        url.push([cat, sub, gender])
                        results.push([cat, sub, gender])
                        url.push([cat, sub])
                        results.push([cat, sub])
                    })
                } else if(genderChecked.length <= 0) {
                    url.push([cat, sub])
                    results.push([cat, sub])
                }
            })
            return results
        } else if(genderChecked.length > 0){
            gender.map(gender => {
                url.push([cat, gender])
                results.push([cat, gender])
            })
        }

        return results

    })
} else {
    // korean
        subcats = cats.map( cat => {
            const results: Array<Array<string>> = []

            getKoreanCats(cat).map( kCat => {
                url.push([kCat])
                results.push([kCat])
                if(subChecked.hasOwnProperty(cat)) {
                    subChecked[cat].map( (subIdx: number) => {
                        const subs: string[] = getKoreanSubs(mappings[cat][subIdx])
                        subs.map(kSub => {
                            if(genderChecked.length > 0) {
                                gender.map( gender => {
                                    getKoreanGenders(gender).map( kGender =>{
                                        url.push([kCat, kSub, kGender])
                                        results.push([kCat, kSub, kGender])
                                        url.push([kCat, kSub])
                                        results.push([kCat, kSub])
                                    })
                                })
                            } else if(genderChecked.length <= 0) {
                                url.push([kCat, kSub])
                                results.push([kCat, kSub])
                            }
                        })
                        return results
                        }) 
                } else if(genderChecked.length > 0){
                    gender.map(gender => {
                        getKoreanGenders(gender).map(kGender => {
                            url.push([kCat, kGender])
                            results.push([kCat, kGender])
                        })
                    })
                }
            })

            return results

        })
    }

        const factorial = (integer: number): number => (integer ? integer * factorial(integer - 1) : 1);

        const mix = (keywords: string[]) => {
            const permutations = [];
            const combo = keywords.filter(item => item.length > 0);
            for (let pos = 0, a = 0; a < factorial(combo.length); a++) {
            permutations.push(combo.join(''));
            pos = a % (combo.length - 1);
            [combo[pos], combo[pos + 1]] = [combo[pos + 1], combo[pos]];
            }
            return permutations;
        };

        console.log('SUBCATS', subcats)

        const data = subcats.map(arr => {
            const results: Array<Array<string>> = []
           arr.map( subArr => {
               const item = mix(subArr)
               results.push(item)
           })
           return results
        })

        const collection: Array<string> = []

        data.map(catArray => {
            catArray.map(subArray => {
                subArray.map(singleCombo => {
                    collection.push(singleCombo)
                })
            })
        })

        const htmlCollection = collection.map( item => {
            csv.push([item, `${urlInput}?utm_source=naver&utm_medium=cpc&utm_campaign=KR-Designer-${designerInput}&utm_content=KR-Designer-${designerInput}-${item}&utm_term=${item}`])
            return(
                <div className={classes.outputFormat} key={item}>                
                    <div className={classes.keyword}>{item}</div>
                    <div>
                        {urlInput}?utm_source=naver&utm_medium=cpc&utm_campaign=KR-Designer-{designerInput}&utm_content=KR-Designer-{designerInput}-{item}&utm_term={item}
                    </div>
                </div>
            )
        })

        return htmlCollection

    }, [checked, genderChecked, subChecked, switchState, url, urlInput, designerInput, classes.keyword, classes.outputFormat, csv]
    );

    return (
        <div className={classes.container}>
            <Input placeholder="URL Here" value={urlInput} onChange={onUrlInputChange}/>
            <Input placeholder="Designer Here" value={designerInput} onChange={onDesignerInputChange}/>
            <Input
                type="text"
                placeholder="Category Search"
                value={catSearch}
                onChange={onCatSearchChange}
            />
                <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>English</Grid>
                    <Grid item>
                        <AntSwitch
                        checked={switchState}
                        onChange={handleSwitchChange}
                        value="checkedC"
                        />
                    </Grid>
                    <Grid item>Korean</Grid>
                    </Grid>
                </Typography>
            <div className={classes.dataAlign}>
                <div className={classes.checkboxContainer}>
                    <div className={classes.root}>
                        <List className={classes.root}>
                            {Object.keys(mappings)
                                .filter(cat => cat.startsWith(catSearch))
                                .map(renderCatItem)}
                        </List>
                    </div>
                    <div className={classes.root}>
                        <List className={classes.root}>
                            {Object.keys(english.gender).map(renderGenderItem)}
                        </List>
                    </div>
                </div>
                <div className={classes.outputContainer}>
                    {checked.length > 0 || genderChecked.length > 0 ? <CSVLink data ={csv} className={classes.breakline}><Button variant="contained" color="primary" className={classes.button}>CSV Download</Button></CSVLink> : null}
                    <div className={classes.dataOutput}>
                        {renderData()}
                    </div>
                </div>
            </div>
        </div>
    );
};
