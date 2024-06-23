    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown-content') && !event.target.matches('.dropdown-content *')) {
            closeAllDropdowns();
        }
    }

    function toggleDropdown(event, dropdownId) {
        event.stopPropagation();
        const dropdown = document.getElementById(dropdownId);
        if (dropdown.classList.contains('show')) {
            closeAllDropdowns();
        } else {
            closeAllDropdowns();
            dropdown.classList.add('show');
        }
    }

    function filterFunction(inputId, dropdownId) {
        const input = document.getElementById(inputId);
        const filter = input.value.toUpperCase();
        const div = document.getElementById(dropdownId);
        const a = div.getElementsByTagName("a");
        for (let i = 0; i < a.length; i++) {
            const txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }

    // There should be a database to save this but I only used a dictionary to store the counts of thumb up for each superhero
    // Or can use a local storage to save the counts
    var superheroCounts = {};

    function selectOption(hiddenInputId, value) {
        document.getElementById(hiddenInputId).value = value;
        document.getElementById(hiddenInputId + 'Button').innerText = value;
        document.getElementById(hiddenInputId + 'Dropdown').classList.remove("show");

        // Show or hide the Thumb Up button based on superhero selection
        var thumbUpButton = document.querySelector('.thumb-up-btn');
        if (value) {
            thumbUpButton.style.display = 'inline-block';
            updateThumbUpCount(value);
        } else {
            thumbUpButton.style.display = 'none';
        }

        getSuperheroDetails();
    }

    function closeAllDropdowns() {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove("show");
        }
    }

    // Function to get superhero details from API
    function getSuperheroDetails() {
        var selectedSuperhero = document.getElementById('superhero').value;
        var apiUrl = '/superhero/' + selectedSuperhero; 
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {

                // Clear previous table headers and rows
                var tableHead = document.getElementById('superheroTableHead');
                var tableBody = document.getElementById('superheroTableBody');
                tableHead.innerHTML = '';
                tableBody.innerHTML = '';

                // Get headers from the first object in data
                var headers = Object.values(data[0]);
                var headerRow = document.createElement('tr');
                headers.forEach((header, index) => {
                    var cleanedHeader = cleanAndCapitalizeHeader(header);
                    var th = document.createElement('th');
                    th.textContent = cleanedHeader;
                    if (index === 0) {

                        th.style.color = 'red';
                        th.style.fontWeight = 'bold';
                    }
                    headerRow.appendChild(th);
                });
                tableHead.appendChild(headerRow);

                // Populate table body with data
                for (let i = 1; i < data.length; i++) {
                    var rowData = Object.values(data[i]);
                    var row = document.createElement('tr');
                    rowData.forEach((value, index) => {
                        var td = document.createElement('td');
                        if (index !== 0) {

                            var link = document.createElement('a');
                            link.textContent = value;
                            link.href = '#'; 
                            link.style.cursor = 'pointer'; 
                            link.addEventListener('click', function(event) {
                                handleHyperlinkClick(headers[index], value, event); 
                            });
                            td.appendChild(link);
                        } else {
                            td.textContent = value;
                        }
                        row.appendChild(td);
                    });
                    tableBody.appendChild(row);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    var myChart = null;
    function handleHyperlinkClick(header, value, event) {
        var apiUrl = '/random_data/' + value;
        console.log(apiUrl);
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {

                var months = data.map(item => item.month);
                var kills = data.map(item => item.kills);

                // Destroy existing chart if it exists
                if (myChart) {
                    myChart.destroy();
                }

                // Draw chart using Chart.js
                var ctxModal = document.getElementById('killsChartModal').getContext('2d');
                myChart = new Chart(ctxModal, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [{
                            label: 'Number of Kills',
                            data: kills,
                            fill: false,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            pointHitRadius: 10,
                            pointBorderWidth: 2,
                            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                            pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 10
                                }
                            }
                        }
                    }
                });

                // Display the modal
                var modal = document.getElementById('chartModal');
                modal.style.display = 'block';
                modal.scrollIntoView({ behavior: 'smooth', block: 'end' });

                // Position the modal at the click position
                if (event) {
                    modal.style.left = (event.pageX + 10) + 'px'; 
                    modal.style.top = (event.pageY + 10) + 'px'; 
                }

                // Close modal when clicking on the close button
                var span = document.getElementsByClassName('close')[0];
                span.onclick = function() {
                    modal.style.display = 'none';
                    if (myChart) {
                        myChart.destroy();
                    }
                };
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function cleanAndCapitalizeHeader(header) {
        var cleanedHeader = header.replace(/[._]/g, ' ');
        
        cleanedHeader = cleanedHeader.replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });
        
        return cleanedHeader;
    }


    function handleThumbUp() {
        var selectedSuperhero = document.getElementById('superhero').value;
        if (selectedSuperhero && superheroCounts[selectedSuperhero] !== undefined) {
            superheroCounts[selectedSuperhero]++;
            document.getElementById('thumbUpCount').textContent = superheroCounts[selectedSuperhero];
        }
    }

    function updateThumbUpCount(superhero) {
        if (!superheroCounts[superhero]) {
            superheroCounts[superhero] = 0;
        }
        document.getElementById('thumbUpCount').textContent = superheroCounts[superhero];
    }

    window.onclick = function(event) {
        var modal = document.getElementById('chartModal');
        var modalContent = document.querySelector('.modal-content');
        if (event.target == modal || !modalContent.contains(event.target)) {
            modal.style.display = 'none';
            if (myChart) {
                myChart.destroy();
            }
        }
    };